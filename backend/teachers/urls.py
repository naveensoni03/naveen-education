from django.urls import path
from .views import TeacherListCreateView, teacher_count # ✅ teacher_count import karein

urlpatterns = [
    path('', TeacherListCreateView.as_view(), name='teacher-list-create'),
    
    # ✅ Ye Line Add Karein:
    path('count/', teacher_count, name='teacher-count'),
]