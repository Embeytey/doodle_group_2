import uuid

from django.db import models
from django.utils.timezone import *
from django.contrib.auth import get_user_model


class TimeSlot(models.Model):
    id = models.BigAutoField(
        primary_key=True,
        db_column="id",
    )
    schedule_poll = models.ForeignKey(
        "SchedulePoll",
        on_delete=models.CASCADE,
        blank=True,
        db_column="schdule_poll_id",
    )
    start_date = models.DateTimeField(
        db_column="start_date",
    )
    end_date = models.DateTimeField(
        db_column="end_date",
    )

    class Meta:
        unique_together = ("schedule_poll", "start_date", "end_date")


class Preference(models.Model):
    id = models.BigAutoField(
        primary_key=True,
        db_column="id",
    )
    description = models.CharField(
        db_column="description",
        max_length=500,
    )


class Meeting(models.Model):
    id = models.BigAutoField(
        primary_key=True,
        db_column="id",
    )
    title = models.CharField(
        db_column="title",
        max_length=100,
    )
    description = models.CharField(
        db_column="description",
        max_length=500,
        blank=True,
        null=True,
    )
    location = models.CharField(
        db_column="location",
        max_length=100,
        blank=True,
        null=True,
    )
    video_conferencing = models.BooleanField(
        db_column="video_conferencing",
    )
    duration = models.DurationField(
        db_column="duration",
    )
    final_date = models.ForeignKey(
        TimeSlot,
        on_delete=models.SET_NULL,
        db_column="final_date",
        blank=True,
        null=True,
    )
    deadline = models.DateTimeField(
        db_column="deadline",
    )
    creation_date = models.DateTimeField(db_column="creation_date", auto_now_add=True)
    passcode = models.CharField(
        db_column="passcode",
        max_length=5,
    )
    user = models.ForeignKey(
        get_user_model(),
        db_column="user_id",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )


class SchedulePoll(models.Model):
    id = models.BigAutoField(primary_key=True, db_column="id")
    voting_start_date = models.DateTimeField()
    voting_deadline = models.DateTimeField()
    meeting = models.ForeignKey(
        to=Meeting, on_delete=models.CASCADE, db_column="meeting_id"
    )


class SchedulePollLink(models.Model):
    id = models.BigAutoField(primary_key=True, db_column="id")
    schedule_poll = models.ForeignKey(
        SchedulePoll,
        on_delete=models.CASCADE,
        db_column="schedule_poll_id",
        blank=True,
    )
    token = models.UUIDField(db_column="token", default=uuid.uuid4)


class Vote(models.Model):
    id = models.BigAutoField(primary_key=True, db_column="id")
    preference = models.ForeignKey(
        Preference, db_column="preference_id", on_delete=models.CASCADE
    )
    time_slot = models.ForeignKey(
        db_column="time_slot_id", to=TimeSlot, on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        get_user_model(),
        db_column="user_id",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )

    class Meta:
        unique_together = ("time_slot", "user")


class Feedback(models.Model):
    id = models.BigAutoField(primary_key=True, db_column="id")
    name = models.CharField(
        db_column="name",
        max_length=20,
    )
    message = models.CharField(
        db_column="message",
        max_length=1500,
    )
    creation_date = models.DateTimeField(db_column="creation_date", auto_now_add=True)
    email = models.EmailField(db_column="email", blank=True, null=True)
    user = models.ForeignKey(
        get_user_model(),
        db_column="user_id",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )


class FeedbackAttachment(models.Model):
    id = models.BigAutoField(primary_key=True, db_column="id")
    feedback = models.ForeignKey(
        Feedback,
        db_column="feedback_id",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    file = models.FileField(upload_to="feedback/", db_column="file")
