from string import ascii_uppercase, digits

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.authtoken.models import Token

from django.contrib.auth import get_user_model, login, logout
from django.utils.crypto import get_random_string
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import Q
from django.conf import settings
from django.contrib.auth.decorators import login_required

from . serializers import *
from . exceptions import *
# from .validators import custom_validation, validate_email, validate_password


# Meeting
@api_view(['GET', 'POST'])
def api_meetings(request):
    if request.method == 'POST' or not request.GET:
        meetings = Meeting.objects.all()
        timeslots = TimeSlot.objects.filter(schedule_poll__meeting_id__in=meetings.values_list("id", flat=True))
        for meeting in meetings:
            meeting.timeslots = timeslots.filter(schedule_poll__meeting=meeting)
        return Response(MeetingSerializer(meetings, many=True).data, status=status.HTTP_200_OK)
    else:
        title_query = Q(title__icontains=request.GET["title"]) if 'title' in request.GET else Q()
        descr_query = Q(description__icontains=request.GET["description"]) if 'description' in request.GET else Q()
        meetings = Meeting.objects.filter(title_query | descr_query).order_by("title")
        timeslots = TimeSlot.objects.filter(schedule_poll__meeting_id__in=meetings.values_list("id", flat=True))
        for meeting in meetings:
            meeting.timeslots = timeslots.filter(schedule_poll__meeting=meeting)
        return Response(MeetingSerializer(meetings, many=True).data, status=status.HTTP_200_OK)


@api_view(['POST', 'PUT'])
def api_meeting_book(request, meeting_id):
    meeting = get_object_or_404(Meeting, pk=meeting_id)
    serializer = MeetingSerializer(meeting, data={'final_date': request.data.get('final_date')}, partial=True)
  
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def api_meeting_timeslots(request, meeting_id):
    meeting = get_object_or_404(Meeting, pk=meeting_id)
    timeslots = TimeSlot.objects.filter(schedule_poll__meeting=meeting)
    return Response(TimeSlotSerializer(timeslots, many=True).data, status=status.HTTP_200_OK)
    

@api_view(['POST', 'PUT'])
@transaction.atomic
def api_meetings_create(request):
    data = request.data
    timeslots = data.pop("timeslots", [])
    meeting = None

    if len(timeslots) == 0:
        raise MissingDataException(detail={"Failure": "error", "TimeSlots": "required field not provided"}, status_code=status.HTTP_400_BAD_REQUEST)

    data["passcode"] = get_random_string(5, allowed_chars=ascii_uppercase + digits)
    meeting_serializer = MeetingSerializer(data=data)

    if not meeting_serializer.is_valid():
        return Response(status=status.HTTP_400_BAD_REQUEST, data=meeting_serializer.errors)
    
    meeting = Meeting(**meeting_serializer.validated_data)
    timeslot_serializer = TimeSlotSerializer(data=timeslots, many=True, context={"ignore_poll": True})
    if not timeslot_serializer.is_valid():
        return Response(status=status.HTTP_400_BAD_REQUEST, data=timeslot_serializer.errors)
    
    meeting.save()  #persist

    schedule_poll = SchedulePoll.objects.create( #persist
        meeting=meeting,
        voting_start_date=meeting.creation_date,
        voting_deadline=meeting.deadline
    )

    link = SchedulePollLink.objects.create( #persist
        schedule_poll=schedule_poll
    )

    timeslots_data = timeslot_serializer.data
    for ts_data in timeslots_data:
        ts_data["schedule_poll"] = schedule_poll

    timeslots = TimeSlot.objects.bulk_create( #persist
        map(lambda item: TimeSlot(**item), timeslots_data)
    ) 

    meeting.timeslots = timeslots
    meeting.link = link

    return Response(status=status.HTTP_201_CREATED, data=MeetingSerializer(meeting).data)
    

@api_view(['GET', 'POST', 'PUT'])
@transaction.atomic
def api_meetings_edit(request, meeting_id):
    if request.method == 'GET':
        meeting = get_object_or_404(Meeting, pk=meeting_id)
        timeslots = TimeSlot.objects.filter(schedule_poll__meeting=meeting)
        meeting.timeslots = timeslots
        return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)
    elif request.method == 'PUT' or request.method == 'POST':
        meeting = get_object_or_404(Meeting, pk=meeting_id)
        serializer = MeetingSerializer(meeting, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE', 'POST'])
def api_meetings_delete(request, meeting_id):
    meeting = get_object_or_404(Meeting, pk=meeting_id)
    meeting.delete()
    return Response(data={'message': 'Meeting deleted successfully'}, status=status.HTTP_200_OK)


#Vote
@transaction.atomic
@api_view(['POST', 'PUT', "UPDATE"])
def api_meeting_vote(request, meeting_id):
    user = request.user if request.user.is_authenticated else get_user_model().objects.get(username=settings.ANONYMOUS_USERNAME)
    meeting = get_object_or_404(Meeting, pk=meeting_id)
    timeslots = TimeSlot.objects.filter(schedule_poll__meeting=meeting)
    votes_serializer = VoteSerializer(data=request.data, many=True, context={"user": user, "poll": SchedulePoll.objects.filter(meeting=meeting)[0]})
    if votes_serializer.is_valid():
        instance = votes_serializer.save()
        vs = VoteSerializerTest(instance=instance)
        return Response(vs.data, status=status.HTTP_201_CREATED)
    return Response(votes_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def api_meeting_vote_options(request):
    return Response(PreferenceSerializer(Preference.objects.all(), many=True).data, status=status.HTTP_200_OK)


@api_view(['GET'])
def api_meeting_votes(request, meeting_id):
    meeting = get_object_or_404(Meeting, pk=meeting_id)
    votes = Vote.objects.filter(time_slot__schedule_poll__meeting=meeting)
    return Response(VoteSerializerOut(votes, many=True).data, status=status.HTTP_200_OK) 


# Feedback
@api_view(['POST'])
@transaction.atomic
def api_feedback_create(request):
    data = request.data
    user = request.user if request.user.is_authenticated else get_user_model().objects.get(username=settings.ANONYMOUS_USERNAME)
    serializer = FeedbackSerializer(data=data, context={'user': user})
    if serializer.is_valid():
        feedback = serializer.save()
        for file in request.FILES.values():
            print(file)
            FeedbackAttachment.objects.create(
                feedback_id=feedback,
                file=file
            )
        return Response(status=status.HTTP_201_CREATED, data=serializer.data)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


@api_view(['GET'])
def api_feedback_detail(request, feedback_id):
    feedback = get_object_or_404(Feedback, pk=feedback_id)
    return Response(status=status.HTTP_200_OK, data=FeedbackSerializer(feedback).data)


@api_view(['GET'])
def api_feedbacks(request):
    feedback = Feedback.objects.all()
    if feedback is not None:
        return Response(status=status.HTTP_200_OK, data=FeedbackSerializer(feedback, many=True).data)

#User
@api_view(['POST'])
@login_required
def api_user_info(request):
    user_id = Token.objects.get(key=request.auth.key).user_id
    user = get_user_model().objects.get(id=user_id)
    return Response(CurrentUserSerializer(user).data, status=status.HTTP_200_OK)
    
    