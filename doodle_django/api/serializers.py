from rest_framework import serializers

from django.utils import timezone
from django.db.models import Q

from .models import *

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = '__all__'

class PreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preference
        fields = '__all__'

class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = '__all__'

    def validate_deadline(self, value):
        if value <= timezone.now() + timezone.timedelta(minutes=5):
            raise serializers.ValidationError("Deadline should be at least 5 minutes in the future.")
        return value

class SchedulePollSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchedulePoll
        fields = '__all__'

class SchedulePollLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchedulePollLink
        fields = ('token',)

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ('time_slot', 'user', 'user_nickname', 'preference')

    def validate(self, data):
        time_slot = data.get('time_slot')
        user = data.get('user')
        user_nickname = data.get('user_nickname')
        preference = data.get('preference')

        existing_vote = Vote.objects.filter(
            Q(time_slot=time_slot) &
            Q(user=user) &
            Q(user_nickname=user_nickname) &
            Q(preference=preference)
        ).first()

        if existing_vote:
            raise serializers.ValidationError("Duplicate vote found")

        return data

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'

class FeedbackAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackAttachment
        fields = '__all__'

#Advanced

class MeetingScheduleSerializer(serializers.ModelSerializer):
    time_slots = serializers.SerializerMethodField()
    link = serializers.SerializerMethodField()

    class Meta:
        model = Meeting
        exclude = ('passcode', 'user')

    def get_time_slots(self, obj):
        try:
            schedule_poll = SchedulePoll.objects.get(meeting=obj)
            timeslots = TimeSlot.objects.filter(schedule_poll=schedule_poll)
            serializer = TimeSlotSerializer(timeslots, many=True)
            return serializer.data
        except SchedulePoll.DoesNotExist:
            return []
    
    def get_link(self, obj):
        try:
            schedule_poll = SchedulePoll.objects.get(meeting=obj)
            link = SchedulePollLink.objects.get(schedule_poll=schedule_poll)
            return SchedulePollLinkSerializer(link).data
        except SchedulePollLink.DoesNotExist:
            return None

class TimeSlotInitialSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        exclude = ('schedule_poll',)  # Exclude SchedulePoll field during initial validation

class VoteReturnSerializer(serializers.ModelSerializer):
    time_slot = serializers.SerializerMethodField()
    schedule_poll_id = serializers.IntegerField(source='time_slot.schedule_poll.id')
    preference = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Vote
        fields = ('time_slot', 'schedule_poll_id', 'user_nickname', 'preference', 'user')

    def get_time_slot(self, obj):
        return {
            'id': obj.time_slot.id,
            'start_date': obj.time_slot.start_date,
            'end_date': obj.time_slot.end_date,
        }
    
    def get_preference(self, obj):
        try:
            preference_id = obj.preference_id
            preference = Preference.objects.get(id=preference_id)
            return preference.description.upper() if preference else None
        except Preference.DoesNotExist:
            return None

    def get_user(self, obj):
        return obj.user.username if obj.user else None

class DateTimeSerializer(serializers.Serializer):
    datetime_field = serializers.DateTimeField()