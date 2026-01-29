from rest_framework import serializers
from .models import Exam, Question

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"

class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, source='question_set', read_only=True)

    class Meta:
        model = Exam
        fields = "__all__"
