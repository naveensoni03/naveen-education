from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse  # ✅ Added for Home Page
from chatbot.views import AIChatAPI

# ✅ Home Page Function (Fixes "Not Found" Error)
def home(request):
    return HttpResponse("""
        <div style='text-align: center; padding-top: 50px; font-family: sans-serif;'>
            <h1>Backend Server is Running Successfully! 🚀</h1>
            <p>Go to <a href='/admin' style='color: blue; font-weight: bold;'>/admin</a> to login.</p>
        </div>
    """)

urlpatterns = [
    # ✅ Main Home Page
    path("", home),

    path("admin/", admin.site.urls),

    # AUTH & CORE
    path("api/auth/", include("accounts.urls")),
    path("api/dashboard/", include("dashboard.urls")),
    path("api/agents/", include("agents.urls")),

    # USERS
    path("api/students/", include("students.urls")),
    path("api/teachers/", include("teachers.urls")),
    path("api/institutions/", include("institutions.urls")),

    # ACADEMIC & ENROLLMENTS
    path("api/courses/", include("courses.urls")),
    path("api/batches/", include("batches.urls")),
    path("api/enrollments/", include("enrollments.urls")),
    
    # RESOURCES
    path("api/attendance/", include("attendance.urls")),
    path("api/fees/", include("fees.urls")),              
    path("api/exams/", include("exams.urls")),            
    path("api/lms/", include("lms.urls")),
    path("api/library/", include("library.urls")),
    path("api/inventory/", include("inventory.urls")),
    path("api/hostel/", include("hostel.urls")),  
    
    # CHATBOT
    path('api/chat/', AIChatAPI.as_view()),
]

# MEDIA FILES CONFIGURATION
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)