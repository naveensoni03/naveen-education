from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now

from accounts.models import User
from agents.models import Agent
from courses.models import Course

class DashboardStatsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Stats fetch karna - Ensuring visibility for Teachers.jsx
        stats = {
            "total_users": User.objects.filter(role='student').count(),
            "total_agents": Agent.objects.count(),
            "active_agents": Agent.objects.filter(is_active=True).count(), # Fixed missing stat
            "total_courses": Course.objects.count(),
            "today": now().date(),
            "institutions": list(Course.objects.all().values('id', 'name')[:10]),
            "teachers": list(Agent.objects.all().values('id', 'name', 'is_active')[:10]),
        }
        return Response(stats)

    def post(self, request):
        # Step 1: Registration Logic
        name = request.data.get('name')
        if not name:
            return Response({"error": "Name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        new_inst = Course.objects.create(name=name)
        return Response({"message": "Institution Registered", "id": new_inst.id}, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        # Delete functionality with ID handling
        try:
            inst = Course.objects.get(pk=pk)
            inst.delete()
            return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Course.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)