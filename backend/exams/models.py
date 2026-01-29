from django.db import models
from django.conf import settings
from courses.models import Course
from batches.models import Batch
from django.db.models import Avg, Count
from django.db.models.signals import post_save # Notification trigger ke liye
from django.dispatch import receiver # Signal catch karne ke liye

# 1. Exam Structure
class Exam(models.Model):
    title = models.CharField(max_length=150)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    chapter_name = models.CharField(max_length=100, blank=True, null=True)
    total_marks = models.IntegerField(default=100)
    passing_marks = models.IntegerField(default=33)
    duration_minutes = models.IntegerField(default=60)
    
    # --- NEW FIELDS FOR SMS NOTIFICATION ---
    exam_date = models.DateTimeField(null=True, blank=True, help_text="Exam ki date aur time")
    is_notification_sent = models.BooleanField(default=False) 
    # ----------------------------------------
    
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} - {self.course.name}"

# 2. Question Bank
class Question(models.Model):
    exam = models.ForeignKey(Exam, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_option = models.CharField(max_length=1) # A, B, C, or D
    marks = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.exam.title} - {self.text[:30]}"

# 3. Exam Attempts & Auto-Evaluation
class ExamAttempt(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    is_evaluated = models.BooleanField(default=False)

    @property
    def batch_rank(self):
        results = ExamAttempt.objects.filter(exam=self.exam).order_by('-score')
        rank = list(results).index(self) + 1
        return rank

    def __str__(self):
        return f"{self.student.email} - {self.exam.title}"

# 4. Answers Logic
class StudentAnswer(models.Model):
    attempt = models.ForeignKey(ExamAttempt, related_name='answers', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.CharField(max_length=1)
    is_correct = models.BooleanField(default=False)

# 5. Result & AI-Based Analytics
class StudentPerformance(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    subject = models.ForeignKey(Course, on_delete=models.CASCADE)
    weak_topics = models.JSONField(default=list)
    improvement_score = models.IntegerField(default=0)
    accuracy_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    performance_prediction = models.TextField(blank=True, null=True)
    last_analyzed = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.email} - Performance Analytics"

# --- ✅ AUTOMATED SMS NOTIFICATION LOGIC (SIGNALS) ---


@receiver(post_save, sender=Exam)
def notify_parents_on_new_exam(sender, instance, created, **kwargs):
    """
    Jab bhi naya Exam create hoga, system automatically 
    parents ko SMS notification trigger karega.
    """
    if created and instance.exam_date:
        # Import yahan kar rahe hain taaki 'Circular Import' error na aaye
        from students.models import Student 
        
        # Batch ke sabhi students ko fetch karna
        students = Student.objects.filter(batch=instance.batch)

        for student in students:
            # Note: Maan lo aapke Student model mein 'parent_phone' field hai
            parent_contact = getattr(student, 'parent_phone', 'No Contact Found')
            
            message = (f"Namaste! SHIVADDA Alert: {student.name} ka {instance.title} exam "
                       f"{instance.exam_date.strftime('%d-%m-%Y')} ko schedule kiya gaya hai. "
                       f"Kripya taiyari par dhyan dein.")
            
            # --- Presentation ke liye Print Statement ---
            print(f"DEBUG: SMS Sent to {parent_contact}: {message}")
            
            # Real SMS ke liye Twilio/Fast2SMS code yahan plug-in hoga
        
        # Ek baar SMS trigger hone par flag update kar dena
        Exam.objects.filter(id=instance.id).update(is_notification_sent=True)