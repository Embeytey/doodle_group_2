from rest_framework.test import APITestCase
from rest_framework import status

from django.contrib.auth import get_user_model
from django.utils.timezone import now, datetime, timedelta
from django.core.files.uploadedfile import SimpleUploadedFile

from .models import *

class MeetingViewSetTests(APITestCase):

    def setUp(self):
        self.user = get_user_model().objects.create(username='test_user', password='test_password')
        self.client.force_authenticate(user=self.user)

    def test_list_meetings(self):
        meeting = Meeting.objects.create(**{
            "title": "Test Meeting",
            "description": "Test description",
            "location": "Test location",
            "video_conferencing": True,
            "duration": timedelta(hours=1),
            "deadline": (now() + timedelta(hours=1)),
            "user": self.user
        })
        response = self.client.get('/api/meetings/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_meeting(self):
        data = {
            "time_slots": [
                {
                    "start_date": now().isoformat(),
                    "end_date": (now() + timedelta(hours=1)).isoformat(),
                },
            ],
            "title": "Test Meeting",
            "description": "Test description",
            "location": "Test location",
            "video_conferencing": True,
            "duration": timedelta(hours=1),
            "deadline": (now() + timedelta(hours=1)).isoformat()
        }
        response = self.client.post('/api/meetings/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Meeting.objects.count(), 1)
        self.assertEqual(TimeSlot.objects.count(), 1)

    def test_update_meeting(self):
        meeting = Meeting.objects.create(**{
            "title": "Test Meeting",
            "description": "Test description",
            "location": "Test location",
            "video_conferencing": True,
            "duration": timedelta(hours=1),
            "deadline": (now() + timedelta(hours=1)),
            "user": self.user
        })

        data = {
            "title": "Updated Title",
            "description": "Updated description",
            "location": "Updated location",
            "video_conferencing": False,
            "duration": "02:00:00",
            "deadline": (now() + timedelta(hours=2)).isoformat()
        }
        response = self.client.put(f'/api/meetings/{meeting.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_meeting = Meeting.objects.get(id=meeting.id)
        self.assertEqual(updated_meeting.title, 'Updated Title')
        self.assertEqual(updated_meeting.video_conferencing, False)

    def test_create_meeting_no_time_slots(self):
        data = {
            "title": "Meeting Without Time Slots",
            "description": "Description",
            "location": "Location",
            "video_conferencing": True,
            "duration": timedelta(hours=1),
            "deadline": (now() + timedelta(hours=1)).isoformat()
        }
        response = self.client.post('/api/meetings/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Meeting.objects.count(), 0)

    def test_retrieve_meeting(self):
        meeting = Meeting.objects.create(**{
            "title": "Test Meeting",
            "description": "Test description",
            "location": "Test location",
            "video_conferencing": True,
            "duration": timedelta(hours=1),
            "deadline": (now() + timedelta(hours=1)),
            "user": self.user
        })
        response = self.client.get(f'/api/meetings/{meeting.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], meeting.id)


class VoteViewSetTests(APITestCase):

    def setUp(self):
        self.user = get_user_model().objects.create(username='test_user', password='test_password')
        self.client.force_authenticate(user=self.user)
        self.meeting = Meeting.objects.create(**{
            "title": "Test Meeting",
            "description": "Test description",
            "location": "Test location",
            "video_conferencing": True,
            "duration": timedelta(hours=1),
            "deadline": (now() + timedelta(hours=1)),
            "user": self.user
        })
        self.time_slot = TimeSlot.objects.create(
            meeting=self.meeting,
            start_date=now(),
            end_date=now() + timedelta(hours=1)
        )
        self.preference = Preference.objects.get(description='YES')

    def test_list_votes_with_valid_token(self):
        link_token = self.meeting.link_token
        response = self.client.get(f'/api/votes/?link_token={link_token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_votes_with_invalid_token(self):
        invalid_token = uuid.uuid4()
        response = self.client.get(f'/api/votes/?link_token={invalid_token}')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_vote(self):
        data = {
            "preference": "YES",
            "link_token": str(self.meeting.link_token),
            "time_slot": {
                "start_date": now().isoformat(),
                "end_date": (now() + timedelta(hours=1)).isoformat(),
            }
        }
        response = self.client.post('/api/votes/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Vote.objects.count(), 1)

    def test_create_vote_with_invalid_preference(self):
        data = {
            "preference": "INVALID_PREFERENCE",
            "link_token": str(self.meeting.link_token),
            "time_slot": {
                "start_date": now().isoformat(),
                "end_date": (now() + timedelta(hours=1)).isoformat(),
            }
        }
        response = self.client.post('/api/votes/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Vote.objects.count(), 0) 

    def test_update_vote(self):
        vote = Vote.objects.create(user=self.user, preference=self.preference, time_slot=self.time_slot)
        data = {
            "preference": "MAYBE",
        }
        response = self.client.put(f'/api/votes/{vote.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_vote = Vote.objects.get(id=vote.id)
        self.assertEqual(updated_vote.preference.description, 'MAYBE')


class FeedbackViewSetTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.feedback_data = {'name':'test', 'message': 'Test feedback', 'email':'test@test.com'}

    def test_get_feedback_not_allowed(self):
        response = self.client.get('/api/feedbacks/')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_list_feedback_not_allowed(self):
        response = self.client.get('/api/feedbacks/')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_retrieve_feedback_not_allowed(self):
        feedback = Feedback.objects.create(name="test", message="test", email="test@test.com")
        response = self.client.get(f'/api/feedbacks/{feedback.id}/')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_update_feedback_not_allowed(self):
        feedback = Feedback.objects.create(name="test", message="test", email="test@test.com")
        data = {'message': 'Updated feedback'}
        response = self.client.put(f'/api/feedbacks/{feedback.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_partial_update_feedback_not_allowed(self):
        feedback = Feedback.objects.create(name="test", message="test", email="test@test.com")
        data = {'message': 'Updated feedback'}
        response = self.client.patch(f'/api/feedbacks/{feedback.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_destroy_feedback_not_allowed(self):
        feedback = Feedback.objects.create(name="test", message="test", email="test@test.com")
        response = self.client.delete(f'/api/feedbacks/{feedback.id}/')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_create_feedback_allowed(self):
        data = {'name':'test', 'message': 'Test feedback', 'email':'test@test.com'}
        response = self.client.post('/api/feedbacks/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Feedback.objects.count(), 1)

    def test_create_feedback_with_file(self):
        file_content = b"Test file content"
        file = SimpleUploadedFile("test_file.txt", file_content, content_type="text/plain")
        data = self.feedback_data.copy()
        data['file'] = file
        response = self.client.post('/api/feedbacks/', data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Feedback.objects.filter(message="Test feedback").exists())
        feedback = Feedback.objects.get(message="Test feedback")
        self.assertTrue(FeedbackAttachment.objects.filter(feedback_id=feedback).exists())

    def test_create_feedback_without_file(self):
        response = self.client.post('/api/feedbacks/', self.feedback_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Feedback.objects.filter(message="Test feedback").exists())
        feedback = Feedback.objects.get(message="Test feedback")
        self.assertFalse(FeedbackAttachment.objects.filter(feedback_id=feedback).exists())


class BookMeetingAPITests(APITestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.meeting = Meeting.objects.create(**{
            "title": "Test Meeting",
            "description": "Test description",
            "location": "Test location",
            "video_conferencing": True,
            "duration": timedelta(hours=1),
            "deadline": (now() + timedelta(hours=1)),
            "user": self.user
        })
        self.time_slot = TimeSlot.objects.create(start_date=now() + timedelta(minutes=1), end_date=now() + timedelta(hours=1), meeting=self.meeting)

    def test_book_meeting_with_valid_data(self):
        data = {"final_date": self.time_slot.id}
        response = self.client.post(f'/api/book/{self.meeting.id}/', data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.meeting.refresh_from_db()
        self.assertEqual(self.meeting.final_date, self.time_slot)

    def test_book_meeting_invalid_meeting_id(self):
        invalid_id = 999
        data = {"final_date": self.time_slot.id}
        response = self.client.post(f'/api/book/{invalid_id}/', data=data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_book_meeting_invalid_time_slot_id(self):
        invalid_time_slot_id = 999
        data = {"final_date": invalid_time_slot_id}
        response = self.client.post(f'/api/book/{self.meeting.id}/', data=data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_book_meeting_unauthorized_user(self):
        unauthorized_user = get_user_model().objects.create_user(username='unauthorized', password='testpassword')
        self.client.force_authenticate(user=unauthorized_user)
        data = {"final_date": self.time_slot.id}
        response = self.client.post(f'/api/book/{self.meeting.id}/', data=data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserInfoAPITests(APITestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.client.force_authenticate(user=self.user)

    def test_get_user_info(self):
        response = self.client.get('/api/user-info/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)
        self.assertEqual(response.data['email'], self.user.email)

    def test_get_user_info_unauthenticated(self):
        self.client.logout()
        response = self.client.get('/api/user-info/')
        self.assertRedirects(response=response, expected_url="/accounts/login/?next=/api/user-info/", status_code=status.HTTP_302_FOUND)