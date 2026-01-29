from django.urls import path
from .views import DashboardStatsAPI

urlpatterns = [
    # Dashboard ka main data fetch karne ke liye
    path("", DashboardStatsAPI.as_view(), name="dashboard-stats"),
    path("<int:pk>/", DashboardStatsAPI.as_view(), name="delete_inst"),
    
]