from django.urls import path
from .views import InstitutionListCreate, InstitutionDetail

urlpatterns = [
    path('', InstitutionListCreate.as_view()),      # /api/institutions/
    path('<int:pk>/', InstitutionDetail.as_view()), # /api/institutions/1/
]