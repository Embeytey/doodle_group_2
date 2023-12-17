from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework import status

from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils.timezone import datetime, timedelta
from django.contrib.auth import get_user_model
from django.urls import reverse


from .models import *

class MeetingViewSetTest(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create(username='testuser', password='12345')
        self.token = Token.objects.create(user=self.user)
        
        # Create a meeting
        self.meeting = Meeting.objects.create(
            user=self.user,
            video_conferencing=True,
            title='Example Meeting',
            description='Discussion on project',
            location='Conference Room A',
            duration=timedelta(hours=1, minutes=30),
            deadline=now() + timedelta(days=15),
            user_nickname='JohnDoe'
        )

        # Create a schedule poll for the meeting
        self.schedule_poll = SchedulePoll.objects.create(
            meeting=self.meeting,
            voting_start_date=self.meeting.creation_date,
            voting_deadline=self.meeting.deadline
        )

        # Create time slots
        self.time_slot_1 = TimeSlot.objects.create(
            start_date= now() + timedelta(days=1),
            end_date= now() + timedelta(days=1, hours=1, minutes=30),
            schedule_poll=self.schedule_poll
        )

        self.time_slot_2 = TimeSlot.objects.create(
            start_date= now() + timedelta(days=2),
            end_date= now() + timedelta(days=2, hours=1, minutes=30),
            schedule_poll=self.schedule_poll
        )

    def test_create_meeting(self):
        url = reverse('api:meeting-list')
        data = {
            'title': 'Team Meeting',
            'description': 'Discuss project progress',
            'location': 'Conference Room A',
            'video_conferencing': True,
            'duration': '01:30:00',
            'deadline': now() + timedelta(days=15),
            'timeslots': [
                {
                    'start_date': str(self.time_slot_1.start_date),
                    'end_date': str(self.time_slot_1.end_date),
                },
                {
                    'start_date': str(self.time_slot_2.start_date),
                    'end_date': str(self.time_slot_2.end_date),
                }
            ]
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_meeting(self):
        url = reverse('api:meeting-detail', kwargs={'pk': self.meeting.id})
        data = {
            'title': 'Updated Title',
            'description': 'Updated Description',
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_meeting(self):
        url = reverse('api:meeting-detail', kwargs={'pk': self.meeting.id})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_meeting(self):
        url = reverse('api:meeting-detail', kwargs={'pk': self.meeting.id})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class VoteViewSetTestCase(APITestCase):
    def setUp(self):
        # Create a user
        self.user = get_user_model().objects.create(username='testuser', password='12345')
        self.token = Token.objects.create(user=self.user)

        # Create a meeting
        self.meeting = Meeting.objects.create(
            user=self.token.user,
            video_conferencing=True,
            title='Example Meeting',
            description='Discussion on project',
            location='Conference Room A',
            duration=timedelta(hours=2),
            deadline=now() + timedelta(days=15),
            user_nickname='JohnDoe'
        )

        # Create a schedule poll for the meeting
        self.schedule_poll = SchedulePoll.objects.create(
            meeting=self.meeting,
            voting_start_date=self.meeting.creation_date,
            voting_deadline=self.meeting.deadline
        )

        # Create a schedule poll link for the meeting
        self.schedule_poll_link = SchedulePollLink.objects.create(
            schedule_poll=self.schedule_poll
        )

        # Create a time slot
        self.time_slot = TimeSlot.objects.create(
            schedule_poll=self.schedule_poll,
            start_date=now(),
            end_date=now() + timedelta(hours=1)
        )

    def test_create_vote(self):
        data = {
            'preference': 'YES',
            'time_slot': {
                'start_date': self.time_slot.start_date,
                'end_date': self.time_slot.end_date
            },
            'schedule_poll_id': self.schedule_poll.id,
            'user_nickname': 'JohnDoe'
        }

        url = reverse('api:vote-list')

        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_vote_missing_schedule_poll_id(self):
        data = {
            'preference': 'NO',
            'time_slot': {
                'start_date': self.time_slot.start_date,
                'end_date': self.time_slot.end_date
            },
            'user_nickname': 'JohnDoe'
        }

        url = reverse('api:vote-list')

        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class FeedbackViewSetTestCase(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='testuser', password='testpassword')
        self.valid_payload = {
            'name': 'Test Name',
            'message': 'Test message',
            'email': 'test@example.com',
            'user': self.user.id
        }
        self.invalid_payload = {
            'name': 'Test Name',
            'message': 'Test message',
            'email': 'invalid_email',  # Invalid email format
            'user': self.user.id
        }

    def test_create_feedback_with_attachment_success(self):
        temp_file = SimpleUploadedFile("test_file.txt", b"file_content")
        files = {'file': temp_file}
        url = reverse('api:feedback-list')
        response = self.client.post(url, self.valid_payload, format='multipart', files=files)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_feedback_with_attachment_invalid_data(self):
        temp_file = SimpleUploadedFile("test_file.txt", b"file_content")
        files = {'file': temp_file}
        url = reverse('api:feedback-list')
        response = self.client.post(url, self.invalid_payload, format='multipart', files=files)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)