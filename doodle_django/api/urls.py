from django.urls import path

from . views import *

app_name="api"

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MeetingViewSet,
    VoteViewSet,
    FeedbackViewSet
)

router = DefaultRouter()
router.register(r'meetings', MeetingViewSet, basename='meeting')
router.register(r'votes', VoteViewSet, basename='vote')
router.register(r'feedbacks', FeedbackViewSet, basename='feedback')

urlpatterns = [
    path('', include(router.urls)),
    path('book/<str:meeting_id>/', api_book, name='api_book'),
    path('user-info/', api_user_info, name='user-info'),
    path('api/votes/', VoteViewSet.as_view({'post': 'create'}), name='create-vote'),
    path('api/votes/<uuid:pk>/', VoteViewSet.as_view({'put': 'update'}), name='update-vote'),
]





