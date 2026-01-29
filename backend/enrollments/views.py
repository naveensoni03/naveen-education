from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny 
from .models import Enrollment
from .serializers import EnrollmentSerializer
from rest_framework import status

class EnrollmentListCreate(APIView):
    # Testing ke liye login requirement hata di hai
    permission_classes = [AllowAny] 

    def get(self, request):
        enrollments = Enrollment.objects.all()
        data = []
        
        for e in enrollments:
            # ✅ SAFETY CHECK: Student ka naam dhoondne ka "Foolproof" tareeka
            display_name = "Student " + str(e.student.id) # Default fallback
            
            try:
                # Option 1: Agar student model User model se juda hai (OneToOne)
                if hasattr(e.student, 'user'):
                    display_name = e.student.user.first_name if e.student.user.first_name else e.student.user.username
                
                # Option 2: Agar student model mein direct 'name' hai
                elif hasattr(e.student, 'name'):
                    display_name = e.student.name
                
                # Option 3: Agar student model mein direct 'username' hai
                elif hasattr(e.student, 'username'):
                    display_name = e.student.username
                    
                # Option 4: Agar sirf first_name hai
                elif hasattr(e.student, 'first_name'):
                    display_name = e.student.first_name

            except Exception:
                pass # Agar kuch bhi gadbad ho, toh Default ID hi dikhayega (Crash nahi hoga)

            data.append({
                "id": e.id,
                "student": e.student.id,
                "student_name": display_name, # ✅ Ab ye field kabhi error nahi dega
                "course": e.course.id,
                "course_name": e.course.name, 
            })
            
        return Response(data)

    def post(self, request):
        serializer = EnrollmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)