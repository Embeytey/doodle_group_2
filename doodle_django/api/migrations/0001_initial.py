# Generated by Django 4.2.7 on 2023-12-10 14:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Feedback",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        db_column="id", primary_key=True, serialize=False
                    ),
                ),
                ("name", models.CharField(db_column="name", max_length=20)),
                ("message", models.CharField(db_column="message", max_length=1500)),
                (
                    "creation_date",
                    models.DateTimeField(auto_now_add=True, db_column="creation_date"),
                ),
                (
                    "email",
                    models.EmailField(
                        blank=True, db_column="email", max_length=254, null=True
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        db_column="user_id",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Meeting",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        db_column="id", primary_key=True, serialize=False
                    ),
                ),
                ("title", models.CharField(db_column="title", max_length=100)),
                (
                    "description",
                    models.CharField(
                        blank=True, db_column="description", max_length=500, null=True
                    ),
                ),
                (
                    "location",
                    models.CharField(
                        blank=True, db_column="location", max_length=100, null=True
                    ),
                ),
                (
                    "video_conferencing",
                    models.BooleanField(db_column="video_conferencing"),
                ),
                ("duration", models.DurationField(db_column="duration")),
                ("deadline", models.DateTimeField(db_column="deadline")),
                (
                    "creation_date",
                    models.DateTimeField(auto_now_add=True, db_column="creation_date"),
                ),
                ("passcode", models.CharField(db_column="passcode", max_length=5)),
            ],
        ),
        migrations.CreateModel(
            name="Preference",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        db_column="id", primary_key=True, serialize=False
                    ),
                ),
                (
                    "description",
                    models.CharField(db_column="description", max_length=500),
                ),
            ],
        ),
        migrations.CreateModel(
            name="SchedulePoll",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        db_column="id", primary_key=True, serialize=False
                    ),
                ),
                ("voting_start_date", models.DateTimeField()),
                ("voting_deadline", models.DateTimeField()),
                (
                    "meeting",
                    models.ForeignKey(
                        db_column="meeting_id",
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.meeting",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="TimeSlot",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        db_column="id", primary_key=True, serialize=False
                    ),
                ),
                ("start_date", models.DateTimeField(db_column="start_date")),
                ("end_date", models.DateTimeField(db_column="end_date")),
                (
                    "schedule_poll",
                    models.ForeignKey(
                        blank=True,
                        db_column="schdule_poll_id",
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.schedulepoll",
                    ),
                ),
            ],
            options={
                "unique_together": {("schedule_poll", "start_date", "end_date")},
            },
        ),
        migrations.CreateModel(
            name="Vote",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        db_column="id", primary_key=True, serialize=False
                    ),
                ),
                (
                    "preference",
                    models.ForeignKey(
                        db_column="preference_id",
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.preference",
                    ),
                ),
                (
                    "time_slot",
                    models.ForeignKey(
                        db_column="time_slot_id",
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.timeslot",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        db_column="user_id",
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AlterUniqueTogether(
            name="vote",
            unique_together={("time_slot", "user")},
        ),
        migrations.CreateModel(
            name="SchedulePollLink",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        db_column="id", primary_key=True, serialize=False
                    ),
                ),
                ("token", models.UUIDField(db_column="token", default=uuid.uuid4)),
                (
                    "schedule_poll",
                    models.ForeignKey(
                        blank=True,
                        db_column="schedule_poll_id",
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.schedulepoll",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="meeting",
            name="final_date",
            field=models.ForeignKey(
                blank=True,
                db_column="final_date",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="api.timeslot",
            ),
        ),
        migrations.AddField(
            model_name="meeting",
            name="user",
            field=models.ForeignKey(
                blank=True,
                db_column="user_id",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.CreateModel(
            name="FeedbackAttachment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        db_column="id", primary_key=True, serialize=False
                    ),
                ),
                ("file", models.FileField(db_column="file", upload_to="feedback/")),
                (
                    "feedback",
                    models.ForeignKey(
                        blank=True,
                        db_column="feedback_id",
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.feedback",
                    ),
                ),
            ],
        ),
    ]
