from django.urls import path
from .views import EnrollmentListCreate

urlpatterns = [
    path('', EnrollmentListCreate.as_view()),
]
