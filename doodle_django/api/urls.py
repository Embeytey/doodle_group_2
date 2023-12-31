from django.urls import path

from . views import *

app_name="api"

urlpatterns = [   
    path("meetings/", api_meetings, name="api_meetings",),
    path("meeting/", api_meeting, name="api_meeting",),
    path("meeting/last/", last_meeting, name="last_meeting",),
    path("meeting/<str:meeting_id>/book/", api_meeting_book, name="api_meeting_book",),
    path("meeting/<str:meeting_id>/timeslots/", api_meeting_timeslots, name="api_meeting_timeslots",),
    path("meetings/new/", api_meetings_create, name="api_meetings_create"),
    path("meetings/<str:meeting_id>/", api_meetings_edit, name="api_meetings_edit"),
    path("meetings/<str:meeting_id>/delete/", api_meetings_delete, name="api_meetings_delete"),
    path("feedback/new/", api_feedback_create, name="api_feedback_create"),
    path('save-preferences/', api_save_preferences, name='api-save-preferences'),

    
]
