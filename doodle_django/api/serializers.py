from rest_framework import serializers

from django.utils import timezone
from django.db.models import Q

from .models import *


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = "__all__"


class PreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preference
        fields = "__all__"


class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = "__all__"

    def validate_deadline(self, value):
        if value <= timezone.now() + timezone.timedelta(minutes=5):
            raise serializers.ValidationError( # pragma: no cover
                "Deadline should be at least 5 minutes in the future."
            )
        return value


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ("time_slot", "user", "preference")

    def validate(self, data):
        time_slot = data.get("time_slot")
        user = data.get("user")
        preference = data.get("preference")

        if Vote.objects.filter(time_slot=time_slot, user=user).exists(): # pragma: no cover
            raise serializers.ValidationError("Duplicate vote found")

        return data


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = "__all__"


class FeedbackAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackAttachment
        fields = "__all__"


# Advanced


class MeetingReturnSerializer(serializers.ModelSerializer):
    time_slots = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Meeting
        fields = "__all__"

    def get_time_slots(self, obj):
        timeslots = TimeSlot.objects.filter(meeting=obj)
        serializer = TimeSlotSerializer(timeslots, many=True)
        return serializer.data

    def get_user(self, obj):
        return obj.user.username if obj.user else None


class VoteReturnSerializer(serializers.ModelSerializer):
    time_slot = serializers.SerializerMethodField()
    preference = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Vote
        fields = (
            "time_slot",
            "preference",
            "user",
        )

    def get_time_slot(self, obj):
        return {
            "id": obj.time_slot.id,
            "start_date": obj.time_slot.start_date,
            "end_date": obj.time_slot.end_date,
        }

    def get_preference(self, obj):
        try:
            preference_id = obj.preference_id
            preference = Preference.objects.get(id=preference_id)
            return preference.description.upper() if preference else None
        except Preference.DoesNotExist: # pragma: no cover
            return None

    def get_user(self, obj):
        return obj.user.username if obj.user else None


class DateTimeSerializer(serializers.Serializer):
    datetime_field = serializers.DateTimeField()
