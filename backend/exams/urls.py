from django.urls import path
from .views import ExamAPI, SubmitExamAPI, AIStudyPlanAPI, NotifyParentsAPI, generate_ai_quiz, save_ai_quiz 

urlpatterns = [
    path("", ExamAPI.as_view()),
    path("<int:exam_id>/submit/", SubmitExamAPI.as_view()),
    path("ai-study-plan/", AIStudyPlanAPI.as_view()),
    path("notify/", NotifyParentsAPI.as_view()),
    path("generate-quiz/", generate_ai_quiz, name='generate_ai_quiz'),
    path("save-quiz/", save_ai_quiz, name='save_ai_quiz'), # ✅ Fixed Line
]