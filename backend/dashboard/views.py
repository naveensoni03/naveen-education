from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Sum

# Models Import
from accounts.models import User
from courses.models import Course
# Agar 'fees' app nahi hai toh niche wali line error de sakti hai, check kar lena
try:
    from fees.models import FeePayment
except ImportError:
    FeePayment = None

@api_view(['GET'])
@permission_classes([AllowAny]) # Filhal AllowAny rakha hai taaki testing mein dikkat na aaye
def student_count(request):
    # Real 3 Students yahan se aayenge
    count = User.objects.filter(role='student').count()
    return Response({'count': count})

@api_view(['GET'])
@permission_classes([AllowAny])
def teacher_count(request):
    # Teachers count (Assuming 'teacher' role or Agents)
    # Filhal User role='teacher' count kar rahe hain
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
        'pending': 0 # Ise baad mein dynamic kar lena
    })