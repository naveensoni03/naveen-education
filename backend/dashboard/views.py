from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Sum

# Models Import
from accounts.models import User
from students.models import Student
# Teacher gine ke liye models
try:
    from agents.models import Agent
except ImportError:
    Agent = None

@api_view(['GET'])
@permission_classes([AllowAny]) 
def student_count(request):
    # ✅ Asli Students ginega (Jo "1" dikha raha hai)
    count = Student.objects.count()
    return Response({'count': count})

@api_view(['GET'])
@permission_classes([AllowAny])
def teacher_count(request):
    # ✅ FIX: Sabse pehle Agent table dekhega
    count = 0
    if Agent:
        count = Agent.objects.count()
    
    # Agar Agent khali hai, toh User table mein 'teacher' role dekhega
    if count == 0:
        count = User.objects.filter(role='teacher').count()
        
    return Response({'count': count})

@api_view(['GET'])
@permission_classes([AllowAny])
def fee_summary(request):
    # Fees summary (Abhi dummy, baad mein real karenge)
    return Response({'collected': 0, 'pending': 0})