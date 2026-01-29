from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework.views import APIView

from .models import Agent
from .serializers import AgentSerializer, AgentCreateSerializer
from .permissions import IsAdminOrSuperAdmin


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({
        "email": request.user.email,
        "role": request.user.role
    })


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "email": request.user.email,
            "role": request.user.role,
        })


class AgentListCreateView(ListCreateAPIView):
    queryset = Agent.objects.select_related("user").all()
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return AgentCreateSerializer
        return AgentSerializer


class AgentDetailView(RetrieveUpdateAPIView):
    queryset = Agent.objects.select_related("user").all()
    serializer_class = AgentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]
