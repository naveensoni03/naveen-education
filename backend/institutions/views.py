from rest_framework import generics
from .models import Institution
from .serializers import InstitutionSerializer

# List aur Create karne ke liye
class InstitutionListCreate(generics.ListCreateAPIView):
    queryset = Institution.objects.all().order_by('-created_at')
    serializer_class = InstitutionSerializer

# Delete aur Retrieve karne ke liye
class InstitutionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer