from django.urls import path
from .views import CourseListCreate, CourseToggleStatus

urlpatterns = [
    path("", CourseListCreate.as_view()),
    path("<int:pk>/status/", CourseToggleStatus.as_view()),
]