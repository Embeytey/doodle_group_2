import uuid

from rest_framework.permissions import BasePermission

from .models import *

class MeetingPermissions(BasePermission):
    def has_permission(self, request, view):
        if view.action == 'list':
            return request.user and request.user.is_superuser
        return True


    def has_object_permission(self, request, view, obj):
        passcode = request.data.get("passcode", request.query_params.get("passcode"))
        link_token = request.data.get("link_token", request.query_params.get("link_token"))
        if view.action in ['update', 'partial_update', 'destroy']:
            if obj.user is not None:
                return request.user == obj.user
            else:
                return obj.passcode == passcode
            return False
        if view.action == 'retrieve':
            if obj.user is not None and request.user == obj.user:
                return True
            if obj.passcode == passcode:
                return True
            schedule_poll = None
            try:
                schedule_poll = SchedulePoll.objects.get(meeting=obj)
                schedule_poll_link = SchedulePollLink.objects.get(schedule_poll=schedule_poll)
                if link_token is not None:
                    link_token = uuid.UUID(link_token)
                    return link_token == schedule_poll_link.token
            except (SchedulePoll.DoesNotExist, SchedulePollLink.DoesNotExist):
                return False
            return False
        return True

class VotePermissions(BasePermission):
    def has_permission(self, request, view):
        if view.action not in ['list', 'create']:
            return True

        schedule_poll_id = request.data.get("schedule_poll_id", request.query_params.get("schedule_poll_id"))
        if schedule_poll_id is None:
            return False
        passcode = request.data.get("passcode", request.query_params.get("passcode"))
        link_token = request.data.get("link_token", request.query_params.get("link_token"))
        if link_token is not None:
            link_token = uuid.UUID(link_token)
        
        schedule_poll = None
        schedule_poll_link = None
        try:
            schedule_poll = SchedulePoll.objects.get(pk=schedule_poll_id)
            schedule_poll_link = SchedulePollLink.objects.get(schedule_poll=schedule_poll)
            if schedule_poll is None:
                return False
        except (SchedulePoll.DoesNotExist):
            return False

        meeting = schedule_poll.meeting

        if request.user and request.user == meeting.user:
            return True
        if meeting.passcode == passcode:
            return True
        if schedule_poll_link.token == link_token:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if view.action in ['update, partial_update', 'retrieve', 'destroy']:
            link_token = request.data.get("link_token", request.query_params.get("link_token"))    
            if link_token is not None:
                link_token = uuid.UUID(link_token)     
            if request.user and request.user == obj.user: 
                return True
            if link_token is None:
                return False
            schedule_poll = obj.time_slot.schedule_poll
            user_nickname = request.data.get('user_nickname')
            try:
                schedule_poll_link = SchedulePollLink.objects.get(schedule_poll=schedule_poll)
                if schedule_poll_link.token == link_token:
                    if view.action == 'retrieve':
                        return True
                    return obj.user_nickname == user_nickname
                return False
            except (SchedulePollLink.DoesNotExist):
                return False
        
        return True 