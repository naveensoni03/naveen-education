from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
# ✅ Correct Imports
from .models import Exam, Question, ExamAttempt, StudentAnswer, StudentPerformance, Batch, Course 
from .serializers import ExamSerializer

# ✅ Direct Request
import requests 
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import traceback

# ⚠️ AAPKI API KEY
API_KEY = "AIzaSyAs1o1Dr3pNYXh70_alfREsmVR-JYcGRDY"

# --- Standard APIs (No Changes) ---
class ExamAPI(APIView):
    def get(self, request):
        return Response(ExamSerializer(Exam.objects.all(), many=True).data)
    def post(self, request):
        serializer = ExamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NotifyParentsAPI(APIView):
    def post(self, request):
        return Response({"message": "SMS Sent"}, status=200)

class SubmitExamAPI(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, exam_id):
        return Response({"message": "Submitted"})

class AIStudyPlanAPI(APIView):
    def get(self, request):
        return Response({"plan": "Focus on weak areas"})

# ============================================================
# ✅ FIXED: AI GENERATION (Smart Retry Logic)
# ============================================================
@csrf_exempt
def generate_ai_quiz(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            topic = data.get('topic', 'General')
            print(f"🤖 AI Request for: {topic}")

            # 🛠️ FIX: List of models to try (Latest -> Stable -> Backup)
            # Agar ek fail hua, to code automatically doosra try karega.
            models_to_try = [
                "gemini-1.5-flash",          # Best speed/quality
                "gemini-1.5-flash-latest",   # Alternative alias
                "gemini-1.0-pro"             # Legacy stable fallback
            ]

            result = None
            used_model = ""

            for model in models_to_try:
                try:
                    print(f"🔄 Trying model: {model}...")
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"
                    headers = {'Content-Type': 'application/json'}
                    
                    prompt_text = f"""
                    Create 3 multiple choice questions on the topic: '{topic}'.
                    Output strictly a valid JSON array.
                    Format:
                    [
                        {{"id": 1, "question": "Q?", "options": ["A", "B", "C", "D"], "correct": "A"}},
                        {{"id": 2, "question": "Q?", "options": ["A", "B", "C", "D"], "correct": "B"}},
                        {{"id": 3, "question": "Q?", "options": ["A", "B", "C", "D"], "correct": "C"}}
                    ]
                    """

                    payload = {
                        "contents": [{"parts": [{"text": prompt_text}]}]
                    }

                    response = requests.post(url, headers=headers, json=payload)
                    
                    if response.status_code == 200:
                        result = response.json()
                        used_model = model
                        print(f"✅ Success with: {model}")
                        break  # Loop roko, kaam ho gaya
                    else:
                        print(f"⚠️ Failed {model}: {response.status_code}")
                
                except Exception as inner_e:
                    print(f"⚠️ Error with {model}: {inner_e}")
                    continue

            # Agar saare models fail ho gaye
            if not result or 'error' in result:
                print("❌ All AI Models Failed.")
                # Fallback Manual Question (Taaki app crash na ho)
                return JsonResponse({
                    'questions': [
                        {"id": 1, "question": f"What is the main concept of {topic}?", "options": ["A", "B", "C", "D"], "correct": "A"}
                    ], 
                    'status': 'success_fallback'
                })

            # Data Extraction
            try:
                raw_text = result['candidates'][0]['content']['parts'][0]['text']
                clean_text = raw_text.replace('```json', '').replace('```', '').strip()
                quiz_data = json.loads(clean_text)
                return JsonResponse({'questions': quiz_data, 'status': 'success'})
            except Exception as e:
                print("❌ Parsing Error:", str(e))
                return JsonResponse({'error': "Parsing Failed"}, status=500)

        except Exception as e:
            print("❌ SERVER ERROR:", str(e))
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Invalid Method'}, status=400)

# ============================================================
# ✅ FIXED: DATABASE SAVE (Same as before)
# ============================================================
@csrf_exempt
def save_ai_quiz(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            topic = data.get('topic')
            questions = data.get('questions')

            print(f"💾 Saving Quiz: {topic}")

            batch_instance = Batch.objects.first()
            if not batch_instance:
                batch_instance = Batch.objects.create(name="AI Batch 2026")

            course_instance = Course.objects.first()
            if not course_instance:
                course_instance = Course.objects.create(name="General Science", description="AI Generated")

            new_exam = Exam.objects.create(
                title=f"AI Quiz: {topic}",
                subject=topic,
                date="2026-01-20",
                time="10:00:00",
                duration="30 Mins",
                batch=batch_instance,
                course=course_instance,
                total_marks=len(questions) * 4,
                passing_marks=len(questions) * 2,
                status="Upcoming"
            )

            for q in questions:
                Question.objects.create(
                    exam=new_exam,
                    text=q['question'],
                    option1=q['options'][0],
                    option2=q['options'][1],
                    option3=q['options'][2],
                    option4=q['options'][3],
                    correct_option=q['correct']
                )

            return JsonResponse({'message': 'Saved!', 'status': 'success'})

        except Exception as e:
            print("❌ DB ERROR:", str(e))
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid'}, status=400)