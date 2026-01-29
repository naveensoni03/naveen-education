from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from .models import Attendance
from .serializers import AttendanceSerializer

# 1. Existing API: Attendance mark karne aur dekhne ke liye
class AttendanceAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(AttendanceSerializer(Attendance.objects.all(), many=True).data)

    def post(self, request):
        serializer = AttendanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

# 2. New API: Lecture-wise analysis aur Eligibility check karne ke liye (PDF Point 21, 23)
class AttendanceEligibilityAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, batch_id):
        # Lecture-wise data analysis 
        stats = Attendance.objects.filter(batch_id=batch_id).values('student__name').annotate(
            total_lectures=Count('id'),
            present_count=Count('id', filter=Q(present=True))
        )
        
        report = []
        for s in stats:
            percentage = (s['present_count'] / s['total_lectures'] * 100) if s['total_lectures'] > 0 else 0
            report.append({
                "student": s['student__name'],
                "percentage": round(percentage, 2),
                # 75% se kam attendance par exam eligibility block (PDF Point 23)
                "eligible": percentage >= 75 
            })
        return Response(report)