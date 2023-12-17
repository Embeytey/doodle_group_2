from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response

from django.shortcuts import redirect
from django.utils.crypto import get_random_string
from django.contrib.auth.decorators import login_required

from .models import *
from .serializers import *
from .permissions import *

class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [MeetingPermissions]

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return MeetingScheduleSerializer
        return MeetingSerializer

    def list(self, request, *args, **kwargs):
        meetings = Meeting.objects.filter(user=request.user)
        return Response(MeetingScheduleSerializer(meetings, many=True).data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        user_pk = request.user.pk if request.user.is_authenticated else None
        timeslots_data = request.data.get('timeslots', [])

        if not timeslots_data:
            return Response({'error': 'No time slots provided.'}, status=status.HTTP_400_BAD_REQUEST)

        meeting_data = {
            'user': user_pk,
            'video_conferencing': request.data.get('video_conferencing', False),
            'title': request.data.get('title', None),
            'description': request.data.get('description', None),
            'location': request.data.get('location', None),
            'user_nickname': request.data.get('user_nickname', None),
            'duration': request.data.get('duration', None),
            'deadline': request.data.get('deadline', None),
            'passcode': get_random_string(length=5)
        }

        meeting_serializer = self.get_serializer(data=meeting_data)
        meeting_serializer.is_valid(raise_exception=True)
        meeting_instance = meeting_serializer.save()

        schedule_poll_instance = SchedulePoll.objects.create(
            meeting=meeting_instance,
            voting_start_date=meeting_instance.creation_date,
            voting_deadline=meeting_instance.deadline
        )
        SchedulePollLink.objects.create(
            schedule_poll=schedule_poll_instance
        )

        timeslots = []
        for index, timeslot_info in enumerate(timeslots_data):
            timeslot_serializer = TimeSlotInitialSerializer(data=timeslot_info)
            if not timeslot_serializer.is_valid():
                return Response({'error': timeslot_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

            timeslot_serializer.validated_data['schedule_poll'] = schedule_poll_instance
            timeslot = TimeSlot.objects.create(**timeslot_serializer.validated_data)
            timeslots.append(timeslot)

        response_data = MeetingScheduleSerializer(meeting_instance).data
        response_data['passcode'] = meeting_instance.passcode

        return Response(response_data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        allowed_fields = ['video_conferencing', 'title', 'description', 'location', 'duration', 'deadline']
        instance = self.get_object()
        partial = True
        data = request.data
        data.pop('passcode', None)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        for key in data.keys():
            if key not in allowed_fields:
                return Response(
                    {'error': f'Field "{key}" is not allowed to be updated.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if 'deadline' in data and instance.deadline != data['deadline']:
            schedule_poll = SchedulePoll.objects.filter(meeting=instance).first()
            if schedule_poll:
                schedule_poll.voting_deadline = instance.deadline
                schedule_poll.save()

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(MeetingScheduleSerializer(instance).data, status=status.HTTP_200_OK)
    

class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [VotePermissions]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return VoteReturnSerializer
        return self.serializer_class

    def list(self, request, *args, **kwargs):
        link_token = request.query_params.get('link_token')

        if link_token is None:
            return Response({'error': 'Link token is required.'}, status=status.HTTP_404_NOT_FOUND)

        link_token = uuid.UUID(link_token)
        schedule_poll_link = None

        try:
            schedule_poll_link = SchedulePollLink.objects.get(token=link_token)
        except SchedulePollLink.DoesNotExist:
            return Response({'error': 'Link token is not valid.'}, status=status.HTTP_404_NOT_FOUND)
        
        schedule_poll = schedule_poll_link.schedule_poll

        votes = Vote.objects.filter(time_slot__schedule_poll_id=schedule_poll.id)
        serializer = self.get_serializer(votes, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        preference = request.data.get('preference')
        time_slot_data = request.data.get('time_slot', {})
        user_nickname = request.data.get('user_nickname')
        user_pk = request.user.pk if request.user.is_authenticated else None
        link_token = request.query_params.get('link_token')

        if link_token is None:
            return Response({'error': 'Link token is required.'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            preference_instance = Preference.objects.get(description=preference)
        except Preference.DoesNotExist:
            return Response({'error': 'Preference does not exist'}, status=status.HTTP_404_NOT_FOUND)

        link_token = uuid.UUID(link_token)
        schedule_poll_link = None

        try:
            schedule_poll_link = SchedulePollLink.objects.get(token=link_token)
        except SchedulePollLink.DoesNotExist:
            return Response({'error': 'Link token is not valid.'}, status=status.HTTP_404_NOT_FOUND)
        
        schedule_poll_instance = schedule_poll_link.schedule_poll

        time_slot_instance, created = TimeSlot.objects.get_or_create(
            schedule_poll=schedule_poll_instance,
            start_date=time_slot_data.get('start_date'),
            end_date=time_slot_data.get('end_date')
        )

        if created:
            time_slot_instance.schedule_poll = schedule_poll_instance
            time_slot_instance.save()

        vote_serializer = VoteSerializer(data={'user': user_pk, 'preference': preference_instance.id, 'user_nickname': user_nickname, 'time_slot': time_slot_instance.id})
        if vote_serializer.is_valid():
            vote_instance = vote_serializer.save()
            return Response(VoteReturnSerializer(vote_instance).data, status=status.HTTP_201_CREATED)
        else:
            return Response(vote_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        allowed_fields = ['preference']
        instance = self.get_object()
        partial = True
        data = request.data

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        for key in data.keys():
            if key not in allowed_fields:
                return Response(
                    {'error': f'Field "{key}" is not allowed to be updated.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        preference = request.data.get('preference')

        try:
            preference_instance = Preference.objects.get(description=preference)
        except Preference.DoesNotExist:
            return Response({'error': 'Preference does not exist'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(instance, data={'preference': preference_instance.id}, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(VoteReturnSerializer(instance).data, status=status.HTTP_200_OK)

    

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

    def get(self, request, *args, **kwargs):
        return Response({"error": "GET method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    def list(self, request, *args, **kwargs):
        return Response({"error": "List method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    def retrieve(self, request, *args, **kwargs):
        return Response({"error": "Retrieve method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    def update(self, request, *args, **kwargs):
        return Response({"error": "Update method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    def partial_update(self, request, *args, **kwargs):
        return Response({"error": "Partial update method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    def destroy(self, request, *args, **kwargs):
        return Response({"error": "Delete method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
def api_link(request, token):
    link_instance = SchedulePollLink.objects.get(token=token)
    if link_instance is None:
        return Response({'error': 'Link is not valid.'}, status=status.HTTP_404_NOT_FOUND)
    meeting_instance = link_instance.schedule_poll.meeting
    return redirect(f"http://localhost:8000/vote/{meeting_instance.pk}")


@api_view(['POST'])
def api_book(request, meeting_id):
    passcode = request.data.pop("passcode", request.query_params.get("passcode"))
    user = request.user if request.user.is_authenticated else None
    try:
        meeting = Meeting.objects.get(pk=meeting_id)
    except Meeting.DoesNotExist:
        return Response({'error': 'Meeting does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = DateTimeSerializer(data=request.data)
    if serializer.is_valid():
        datetime_value = serializer.validated_data['datetime_field']
        meeting.final_date = datetime_value
        return Response({}, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@login_required
def api_user_info(request):
    user = request.user
    user_data = {
        'username': user.username,
        'email': user.email,
    }
    return Response(user_data, status=status.HTTP_200_OK)
