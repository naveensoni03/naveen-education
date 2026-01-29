from django.urls import path
from . import views

urlpatterns = [
    # Ye 3 URLs Frontend ke liye hain
    path("students/count/", views.student_count, name="student-count"),
    path("teachers/count/", views.teacher_count, name="teacher-count"),
    path("fees/summary/", views.fee_summary, name="fee-summary"),
]