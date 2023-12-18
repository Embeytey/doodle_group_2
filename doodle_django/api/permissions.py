import uuid

from rest_framework.permissions import BasePermission

from django.db.models import Q

from .models import *

class MeetingPermissions(BasePermission):
    def has_object_permission(self, request, view, obj):
        if view.action not in ["update", "partial_update", "destroy"]:
            return request.user == obj.user # pragma: no cover
        return True


class VotePermissions(BasePermission):
    def has_object_permission(self, request, view, obj):
        if view.action not in ["update", "partial_update", "destroy"]:
            return request.user == obj.user # pragma: no cover
        return True
