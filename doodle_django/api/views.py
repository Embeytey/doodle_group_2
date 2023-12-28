from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response

from django.shortcuts import redirect
from django.utils.crypto import get_random_string
from django.db import transaction
from django.contrib.auth.decorators import login_required

from .models import *
from .serializers import *
from .permissions import *


class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated, MeetingPermissions]

    def get_serializer_class(self):
        if self.action in ["retrieve", "list"]:
            return MeetingReturnSerializer
        return MeetingSerializer

    def list(self, request, *args, **kwargs):
        '''
        usage:
        get ../api/meetings/      to get all the meetings created by an user
        or
        get ../api/meetings/?link_token=token    to get a meeting using the token
        '''

        link_token = request.query_params.get('link_token')
        if link_token:
            try:
                link_token = uuid.UUID(link_token, version=4)
                meeting = Meeting.objects.get(link_token=link_token)
            except ValueError:
                return Response({'error': 'Invalid link_token provided'}, status=status.HTTP_400_BAD_REQUEST)
            except Meeting.DoesNotExist:
                return Response({"error": "No Meeting found for current token."}, status=status.HTTP_404_NOT_FOUND)
            return Response(MeetingReturnSerializer([meeting], many=True).data, status=status.HTTP_200_OK)

        else:
            meetings = Meeting.objects.filter(user=request.user)
            return Response(
                MeetingReturnSerializer(meetings, many=True).data,
                status=status.HTTP_200_OK,
            )

    def create(self, request, *args, **kwargs):
        '''
        usage:
        post ../api/meetings/
        request body:
        {
            "time_slots": [
                {
                    "start_date": "dd-MM-yyyy-hh-mm",
                    "end_date": "dd-MM-yyyy-hh-mm",
                },
            ],
            "title": "Example Meeting",
            "description": "This is an example meeting description.",
            "location": "Meeting Room A",
            "video_conferencing": true,
            "duration": "hh-mm-ss",
            "deadline": "dd-MM-yyyy-hh-mm"
        }

        a vote is automatically created by this api for each time slot provided, with a preference of "YES"
        '''
        
        time_slots_data = request.data.get("time_slots", [])

        if not time_slots_data:
            return Response(
                {"error": "No time slots provided."}, status=status.HTTP_400_BAD_REQUEST
            )

        meeting_serializer = self.get_serializer(data={
            "user": request.user.id,
            "video_conferencing": request.data.get("video_conferencing", False),
            "title": request.data.get("title", None),
            "description": request.data.get("description", None),
            "location": request.data.get("location", None),
            "duration": request.data.get("duration", None),
            "deadline": request.data.get("deadline", None),
        })

        meeting_serializer.is_valid(raise_exception=True)
        meeting_instance = meeting_serializer.save()

        preference_instance = Preference.objects.get(description="YES")
       
        for time_slot_info in time_slots_data:
            time_slot_info["meeting"] = meeting_instance.id
            time_slot_serializer = TimeSlotSerializer(data=time_slot_info)
            if time_slot_serializer.is_valid():
                time_slot_instance = TimeSlot.objects.create(**time_slot_serializer.validated_data)
                Vote.objects.create(
                    user=request.user,
                    preference=preference_instance,
                    time_slot=time_slot_instance
                )
                
        response_data = MeetingReturnSerializer(meeting_instance).data

        return Response(response_data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        '''
        usage:
        put ../api/meetings/
        request body:
        {
            "title": "Example Meeting",
            "description": "This is an example meeting description.",
            "location": "Meeting Room A",
            "video_conferencing": true,
            "duration": "hh-mm-ss",
            "deadline": "dd-MM-yyyy-hh-mm"
        }
        '''
        allowed_fields = [
            "title",
            "description",
            "location",
            "video_conferencing",
            "duration",
            "deadline",
        ]
        instance = self.get_object()
        partial = True
        data = request.data

        if getattr(instance, "_prefetched_objects_cache", None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {} # pragma: no cover

        for key in data.keys():
            if key not in allowed_fields:
                return Response( # pragma: no cover
                    {"error": f'Field "{key}" is not allowed to be updated.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(
            MeetingReturnSerializer(instance).data, status=status.HTTP_200_OK
        )


class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [IsAuthenticated, VotePermissions]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return VoteReturnSerializer
        return self.serializer_class
    

    def list(self, request, *args, **kwargs):
        '''
        usage:
        get ../api/votes/?link_token=token
        '''
        link_token = request.query_params.get("link_token")

        if link_token is None:
            return Response( # pragma: no cover
                {"error": "Link token is required."}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            link_token = uuid.UUID(link_token)        
            meeting = Meeting.objects.get(link_token=link_token)
            votes = Vote.objects.filter(time_slot__meeting=meeting)
            serializer = self.get_serializer(votes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Meeting.DoesNotExist:
            return Response(
                {"error": "No Meeting found for current token."}, status=status.HTTP_404_NOT_FOUND
            ) 

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        '''
        usage:
        post ../api/votes/ or post ../api/votes/?link_token=token
        request body:
        {
            "link_token": token,
            "votes": [
                {
                    "preference": "YES/MAYBE/NO",
                    "time_slot": {
                        "start_date": "dd-MM-yyyy-hh-mm",
                        "end_date": "dd-MM-yyyy-hh-mm",
                    }
                },
            ]
        }
        if time slot does not exists, it gets created by this api.
        '''
        link_token = request.data.get("link_token")
        votes_data = request.data.get("votes", [])

        if link_token is None:
            return Response(
                {"error": "Link token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            link_token = uuid.UUID(link_token)
            meeting = Meeting.objects.get(link_token=link_token)
        except Meeting.DoesNotExist:
            return Response(
                {"error": "No Meeting found for the provided token."},
                status=status.HTTP_404_NOT_FOUND
            )

        response_data = []

        for vote_data in votes_data:
            preference_desc = vote_data.get("preference")
            time_slot_data = vote_data.get("time_slot", {})
            preference_instance = None
            
            try:
                preference_instance = Preference.objects.get(description__iexact=preference_desc)
            except Preference.DoesNotExist:
                return Response(
                    {"error": f"Preference '{preference_desc}' does not exist."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            time_slot_instance, created = TimeSlot.objects.get_or_create(
                meeting=meeting,
                start_date=time_slot_data.get("start_date"),
                end_date=time_slot_data.get("end_date"),
            )

            existing_vote = Vote.objects.filter(time_slot=time_slot_instance, user=request.user).first()
            
            if existing_vote:
                existing_vote.preference = preference_instance
                existing_vote.save()
                response_data.append(VoteReturnSerializer(existing_vote).data)
            else:
                vote_serializer = VoteSerializer(
                    data={
                        "user": request.user.id,
                        "preference": preference_instance.id,
                        "time_slot": time_slot_instance.id,
                    }
                )

                if vote_serializer.is_valid():
                    vote_instance = vote_serializer.save()
                    response_data.append(VoteReturnSerializer(vote_instance).data)
                else:
                    return Response(
                        vote_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )

        return Response(response_data, status=status.HTTP_201_CREATED)


    def update(self, request, *args, **kwargs):
        '''
        usage:
        put ../api/votes/id/  <-- id is pk of vote
        request body:
        {
            "preference": "YES/MAYBE/NO",
            "link_token": token
        }
        '''

        allowed_fields = ["preference"]
        instance = self.get_object()
        partial = True
        data = request.data

        if getattr(instance, "_prefetched_objects_cache", None): # pragma: no cover
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        for key in data.keys():
            if key not in allowed_fields: # pragma: no cover
                return Response(
                    {"error": f'Field "{key}" is not allowed to be updated.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        preference = request.data.get("preference")

        try:
            preference_instance = Preference.objects.get(description=preference)
        except Preference.DoesNotExist: # pragma: no cover
            return Response(
                {"error": "Preference does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(
            instance, data={"preference": preference_instance.id}, partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(VoteReturnSerializer(instance).data, status=status.HTTP_200_OK)


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        if request.user.is_authenticated:
            data["user"] = request.user.id
        serializer = FeedbackSerializer(data=data)
        if serializer.is_valid():
            feedback = serializer.save()
            for file in request.FILES.values():
                FeedbackAttachment.objects.create(
                    feedback=feedback,
                    file=file
                )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):
        return Response( # pragma: no cover
            {"error": "GET method not allowed"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def list(self, request, *args, **kwargs):
        return Response(
            {"error": "List method not allowed"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def retrieve(self, request, *args, **kwargs):
        return Response(
            {"error": "Retrieve method not allowed"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def update(self, request, *args, **kwargs):
        return Response(
            {"error": "Update method not allowed"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def partial_update(self, request, *args, **kwargs):
        return Response(
            {"error": "Partial update method not allowed"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def destroy(self, request, *args, **kwargs):
        return Response(
            {"error": "Delete method not allowed"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )


@api_view(["POST"])
@login_required
def api_book(request, meeting_id):
    '''
    usage:
    post ../api/book/id/  <-- id is pk of meeting
    request body:
    {
        "final_date": "id of an existing time slot linked to the chosen meeting",
    }
    '''
    try:
        meeting = Meeting.objects.get(pk=meeting_id)
    except Meeting.DoesNotExist:
        return Response(
            {"error": "Meeting does not exist."}, status=status.HTTP_404_NOT_FOUND
        )
    if meeting.user != request.user:
        return Response(
            {"error": "Permission denied."}, status.HTTP_401_UNAUTHORIZED
        )
    try:
        time_slot = TimeSlot.objects.get(pk=request.data.get("final_date"))
    except TimeSlot.DoesNotExist:
        return Response(
            {"error": "Time slot does not exist or is not linked to the right Meeting."}, status=status.HTTP_404_NOT_FOUND
        )

    meeting.final_date = time_slot
    meeting.save()
    return Response({}, status=status.HTTP_200_OK)


@api_view(["GET"])
@login_required
def api_user_info(request):
    '''
    usage:
    get ../api/user-info/
    '''
    user = request.user
    user_data = {
        "username": user.username,
        "email": user.email,
    }
    return Response(user_data, status=status.HTTP_200_OK)
