from django.db import models
from django.utils.timezone import now
from accounts.models import User
from students.models import Student
from courses.models import Course

# 1. Course-wise Fee Plan (Point 50)
class FeePlan(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE) # 
    total_fee = models.DecimalField(max_digits=10, decimal_places=2) # 
    installment_count = models.IntegerField(default=1) # 
    penalty_per_day = models.DecimalField(max_digits=6, decimal_places=2, default=50.00) # 

    def __str__(self):
        return f"{self.course.name} Plan - {self.total_fee}"

# 2. Installment handling & Due management (Point 51 & 52)
class Installment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE) # 
    amount = models.DecimalField(max_digits=10, decimal_places=2) # 
    due_date = models.DateField() # 
    is_paid = models.BooleanField(default=False)
    paid_date = models.DateField(null=True, blank=True)
    
    def calculate_penalty(self):
        """Automatic Penalty Calculation based on Due Date (Point 52)"""
        if not self.is_paid and now().date() > self.due_date: # 
            days_late = (now().date() - self.due_date).days
            # FeePlan se per day rate uthana
            fee_plan = FeePlan.objects.filter(course=self.student.course).first()
            rate = fee_plan.penalty_per_day if fee_plan else 50.00
            return days_late * rate
        return 0

    def __str__(self):
        return f"{self.student.name} - Due: {self.due_date} (Status: {'Paid' if self.is_paid else 'Pending'})"

# 3. Student Fee Ledger & Transaction History (Point 53)
class FeeTransaction(models.Model):
    PAYMENT_MODES = [
        ('Cash', 'Cash'),
        ('Online', 'Online'),
        ('UPI', 'UPI'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE) # 
    installment = models.ForeignKey(Installment, on_delete=models.SET_NULL, null=True, blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2) # 
    penalty_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_date = models.DateTimeField(auto_now_add=True)
    transaction_id = models.CharField(max_length=100, unique=True)
    payment_mode = models.CharField(max_length=50, choices=PAYMENT_MODES)

    def __str__(self):
        return f"TXN: {self.transaction_id} - {self.student.name}"

# 4. Overall Student Fee Summary (Point 53)
class FeeLedger(models.Model):
    student = models.OneToOneField(User, on_delete=models.CASCADE) # 
    total_fee_assigned = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    @property
    def remaining_balance(self):
        return self.total_fee_assigned - self.total_paid

    def __str__(self):
        return f"Ledger: {self.student.username} - Balance: {self.remaining_balance}"