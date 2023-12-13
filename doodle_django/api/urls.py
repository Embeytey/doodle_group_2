from django.urls import path

from . views import *

app_name="api"

urlpatterns = []
# Meetings CRUD
urlpatterns += path("meetings/", api_meetings, name="api_meetings"),
urlpatterns += path("meetings/new/", api_meetings_create, name="api_meetings_create"),
urlpatterns += path("meetings/vote-options/", api_meeting_vote_options, name="api_meeting_vote_options"), #vote options
urlpatterns += path("meetings/<str:meeting_id>/", api_meetings_edit, name="api_meetings_edit"),
urlpatterns += path("meetings/<str:meeting_id>/delete/", api_meetings_delete, name="api_meetings_delete"),
# Meetings Other operations
urlpatterns += path("meetings/<str:meeting_id>/book/", api_meeting_book, name="api_meeting_book"), #book
urlpatterns += path("meetings/<str:meeting_id>/vote/", api_meeting_vote, name="api_meeting_vote"), #vote
urlpatterns += path("meetings/<str:meeting_id>/votes/", api_meeting_votes, name="api_meeting_votes"), #get all votes for a meeting
urlpatterns += path("meetings/<str:meeting_id>/timeslots/", api_meeting_timeslots, name="api_meeting_timeslots"), #get only timeslots
# Feedbacks
urlpatterns += path("feedbacks/new/", api_feedback_create, name="api_feedback_create"),
urlpatterns += path("feedbacks/<str:feedback_id>/", api_feedback_detail, name="api_feedback_detail"),
urlpatterns += path("feedbacks/", api_feedbacks, name="api_feedbacks"),
#urlpatterns += path('participant-preference/', api_participant_preference_create, name='api_participant_preference_create'),
#User
urlpatterns += path("user-info/", api_user_info, name="api_user_info"),
