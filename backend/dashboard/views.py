from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Sum

# Models Import
from accounts.models import User
from agents.models import Agent      # ✅ Teacher/Staff gine ke liye
from students.models import Student  # ✅ Students gine ke liye

try:
    from fees.models import FeePayment
except ImportError:
    FeePayment = None

@api_view(['GET'])
@permission_classes([AllowAny]) 
def student_count(request):
    # Admission list se total students ginega
    count = Student.objects.count()
    return Response({'count': count})

@api_view(['GET'])
@permission_classes([AllowAny])
def teacher_count(request):
    # ✅ FIX: Ab ye User table nahi, balki Agent/Teacher table ginega
    # Agar aapne Agent mein teachers add kiye hain toh ye match ho jayega
    count = Agent.objects.count()
    return Response({'count': count})

@api_view(['GET'])
@permission_classes([AllowAny])
def fee_summary(request):
    if FeePayment:
        collected = FeePayment.objects.aggregate(Sum('amount'))['amount__sum'] or 0
    else:
        collected = 0
        
    return Response({
        'collected': collected,
        'pending': 0 
    })