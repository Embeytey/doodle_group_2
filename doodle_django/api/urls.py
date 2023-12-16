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
router.register(r'meetings', MeetingViewSet)
router.register(r'votes', VoteViewSet)
router.register(r'feedbacks', FeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('link/<str:token>/', api_link, name="api_link")
]