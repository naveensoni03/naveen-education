from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Teacher
from .serializers import TeacherSerializer

# Ye pehle se hoga (List/Create ke liye)
class TeacherListCreateView(generics.ListCreateAPIView):
    queryset = Teacher.objects.all().order_by('-created_at')
    serializer_class = TeacherSerializer

# ✅ YE FUNCTION ADD KAREIN (Dashboard Count ke liye)
@api_view(['GET'])
def teacher_count(request):
    count = Teacher.objects.count()
    return Response({'count': count})