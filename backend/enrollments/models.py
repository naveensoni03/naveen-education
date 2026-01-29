from django.db import models
from students.models import Student
from courses.models import Course

class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student.name} -> {self.course.name}"


from django.db.models.signals import post_save
from django.dispatch import receiver
from fees.models import FeePlan, Installment
from datetime import date, timedelta

@receiver(post_save, sender=Enrollment)
def generate_installments(sender, instance, created, **kwargs):
    if created:
        # Course ka fee plan dhoondein
        plan = FeePlan.objects.filter(course=instance.course).first()
        if plan:
            amount_per_installment = plan.total_fee / plan.installment_count
            for i in range(plan.installment_count):
                # Har mahine ki installment generate karein (PDF Point 51)
                Installment.objects.create(
                    student=instance.student,
                    amount=amount_per_installment,
                    due_date=date.today() + timedelta(days=30 * (i + 1))
                )
                
                
                
                
                
                
from django.db.models.signals import post_save
from django.dispatch import receiver
from fees.models import Installment
from datetime import date, timedelta

@receiver(post_save, sender=Enrollment)
def create_student_installments(sender, instance, created, **kwargs):
    if created:
        # Course ki total fee ko 3 installments mein baantna (Point 51)
        base_fee = instance.course.fee / 3
        for i in range(3):
            Installment.objects.create(
                student=instance.student,
                amount=base_fee,
                due_date=date.today() + timedelta(days=30 * (i + 1))
            )