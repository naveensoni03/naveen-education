from django.urls import path
from .views import AttendanceAPI, AttendanceEligibilityAPI

urlpatterns = [
    path("", AttendanceAPI.as_view()),
    path("eligibility/<int:batch_id>/", AttendanceEligibilityAPI.as_view()), # Naya Path
]