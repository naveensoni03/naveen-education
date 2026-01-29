from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Sum

# Models Import
from accounts.models import User
from courses.models import Course
from students.models import Student  # ✅ Naya Import: Student Table

# Agar 'fees' app nahi hai toh niche wali line error de sakti hai
try:
    from fees.models import FeePayment
except ImportError:
    FeePayment = None

@api_view(['GET'])
@permission_classes([AllowAny]) 
def student_count(request):
    # ✅ FIX: Ab ye Login User nahi, balki 'Student' table ginega
    # Jo 1 Student aapne banaya hai, wo yahan count ho jayega.
    count = Student.objects.count()
    return Response({'count': count})

@api_view(['GET'])
@permission_classes([AllowAny])
def teacher_count(request):
    # Teachers count (Assuming 'teacher' role)
    count = User.objects.filter(role='teacher').count()
    return Response({'count': count})

@api_view(['GET'])
@permission_classes([AllowAny])
def fee_summary(request):
    # Fees Calculation
    if FeePayment:
        collected = FeePayment.objects.aggregate(Sum('amount'))['amount__sum'] or 0
    else:
        collected = 0
        
    return Response({
        'collected': collected,
        'pending': 0 
    })