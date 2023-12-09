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

from . serializers import *
from . exceptions import *
# from .validators import custom_validation, validate_email, validate_password


# Meeting
@api_view(['GET', 'POST'])
def api_meetings(request):
    if request.method == 'POST' or not request.GET:
        meetings = Meeting.objects.all()
        timeslots = TimeSlot.objects.filter(schedule_pool__meeting_id__in=meetings.values_list("id", flat=True))
        for meeting in meetings:
            meeting.timeslots = timeslots.filter(schedule_pool__meeting=meeting)
        return Response(MeetingSerializer(meetings, many=True).data, status=status.HTTP_200_OK)
    else:
        if 'title' in request.GET:
            meetings = Meeting.objects.filter(title__icontains=request.GET["title"]).order_by("title")
            timeslots = TimeSlot.objects.filter(schedule_pool__meeting_id__in=meetings.values_list("id", flat=True))
            for meeting in meetings:
                meeting.timeslots = timeslots.filter(schedule_pool__meeting=meeting)
            return Response(MeetingSerializer(meetings, many=True).data, status=status.HTTP_200_OK)


@api_view(['POST', 'PUT'])
def api_meeting_book(request, meeting_id):
    try:
        meeting = get_object_or_404(Meeting, pk=meeting_id)

        serializer = MeetingSerializer(meeting, data={'final_date': request.data.get('final_date')}, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Meeting.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST', 'PUT'])
def api_meeting_timeslots(request, meeting_id):
    try:
        meeting = get_object_or_404(Meeting, pk=meeting_id)

        serializer = MeetingSerializer(meeting, data={'final_date': request.data.get('final_date')}, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Meeting.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
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

    timeslot_serializer = TimeSlotSerializer(data=timeslots, many=True)

    if not timeslot_serializer.is_valid():
        return Response(status=status.HTTP_400_BAD_REQUEST, data=timeslot_serializer.errors)
    
    meeting.save()  #persist

    schedule_pool = SchedulePool.objects.create( #persist
        meeting=meeting,
        voting_start_date=meeting.creation_date,
        voting_deadline=meeting.deadline            
    )

    link = SchedulePoolLink.objects.create( #persist
        schedule_pool=schedule_pool
    )

    timeslots_data = timeslot_serializer.data
    for ts_data in timeslots_data:
        ts_data["schedule_pool"] = schedule_pool

    timeslots = TimeSlot.objects.bulk_create( #persist
        map(lambda item: TimeSlot(**item), timeslots_data)
    ) 

    meeting.timeslots = timeslots
    meeting.link = link

    return Response(status=status.HTTP_201_CREATED, data=MeetingSerializer(meeting).data)
    

@api_view(['GET', 'POST', 'PUT'])
def api_meetings_edit(request, meeting_id):
    if request.method == 'GET':
        meeting = get_object_or_404(Meeting, pk=meeting_id)
        timeslots = TimeSlot.objects.filter(schedule_pool__meeting=meeting)
        meeting.timeslots = timeslots
        return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)
    elif request.method == 'PUT' or request.method == 'POST':
        meeting = get_object_or_404(Meeting, pk=meeting_id)
        serializer = MeetingSerializer(meeting, data=request.data)
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
@api_view(['POST', 'PUT'])
def api_meeting_vote(request, meeting_id):
    meeting = get_object_or_404(Meeting, pk=meeting_id)
    timeslots = TimeSlot.objects.filter(schedule_pool__meeting=meeting)
    votes = VoteSerializer(data=request.data, many=True)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def api_meeting_vote_options(request):
    return Response(PreferenceSerializer(Preference.objects.all(), many=True).data, status=status.HTTP_200_OK)


# Feedback
@api_view(['POST'])
def api_feedback_create(request):
    data = request.data
    serializer = FeedbackSerializer(data=data, context={'user': request.user})
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
def api_feedback_detail(request, feedback_id):
    feedback = Feedback.objects.filter(pk=feedback_id)
    if feedback is not None:
        return Response(status=status.HTTP_200_OK, data=FeedbackSerializer(feedback).data)

@api_view(['GET'])
def api_feedbacks(request):
    feedback = Feedback.objects.all()
    if feedback is not None:
        return Response(status=status.HTTP_200_OK, data=FeedbackSerializer(feedback, many=True).data)
    











    

# @api_view(['POST'])
# def api_participant_preference_create(request):
#     if request.method == 'POST':
#         data = request.data.copy()

#         # Extract time slots and format them
#         selected_timeslots = data.get('selected_timeslots', [])
#         formatted_timeslots = [
#             {
#                 "start_date": slot.get("start_date"),
#                 "end_date": slot.get("end_date"),
#                 "preference": slot.get("preference", ParticipantPreference.YES),
#             }
#             for slot in selected_timeslots
#         ]
#         data['selected_timeslots'] = formatted_timeslots

#         serializer = ParticipantPreferenceSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=201)
#         return Response(serializer.errors, status=400)


# class UserRegister(APIView):
# 	permission_classes = (permissions.AllowAny,)
# 	def post(self, request):
# 		clean_data = custom_validation(request.data)
# 		serializer = UserRegisterSerializer(data=clean_data)
# 		if serializer.is_valid(raise_exception=True):
# 			user = serializer.create(clean_data)
# 			if user:
# 				return Response(serializer.data, status=status.HTTP_201_CREATED)
# 		return Response(status=status.HTTP_400_BAD_REQUEST)


# class UserLogin(APIView):
# 	permission_classes = (permissions.AllowAny,)
# 	authentication_classes = (SessionAuthentication,)
# 	##
# 	def post(self, request):
# 		data = request.data
# 		assert validate_email(data)
# 		assert validate_password(data)
# 		serializer = UserLoginSerializer(data=data)
# 		if serializer.is_valid(raise_exception=True):
# 			user = serializer.check_user(data)
# 			login(request, user)
# 			return Response(serializer.data, status=status.HTTP_200_OK)


# class UserLogout(APIView):
# 	permission_classes = (permissions.AllowAny,)
# 	authentication_classes = ()
# 	def post(self, request):
# 		logout(request)
# 		return Response(status=status.HTTP_200_OK)


# class UserView(APIView):
# 	permission_classes = (permissions.IsAuthenticated,)
# 	authentication_classes = (SessionAuthentication,)
# 	##
# 	def get(self, request):
# 		serializer = UserSerializer(request.user)
# 		return Response({'user': serializer.data}, status=status.HTTP_200_OK)

# @api_view(['POST'])
# def register_user(request):
#     if request.method == 'POST':
#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
