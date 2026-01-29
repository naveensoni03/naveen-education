from datetime import date
from .models import Installment, FeePlan

def calculate_daily_penalties():
    # Aaj ki date se pehle ki unpaid installments dhoondein 
    overdue_installments = Installment.objects.filter(
        due_date__lt=date.today(),
        is_paid=False
    )
    
    for ins in overdue_installments:
        # Course ke plan se daily penalty rate nikaalein 
        plan = FeePlan.objects.filter(course__student=ins.student).first()
        if plan and plan.penalty_per_day > 0:
            days_late = (date.today() - ins.due_date).days
            ins.penalty_applied = days_late * plan.penalty_per_day
            ins.save()
            
            
            
            
            
from datetime import date
from .models import Installment

def apply_daily_penalties():
    # Aaj ki date se purani unpaid installments par penalty lagana
    overdue_fees = Installment.objects.filter(due_date__lt=date.today(), is_paid=False)
    for fee in overdue_fees:
        days_late = (date.today() - fee.due_date).days
        # ₹50 per day late fee calculation
        fee.penalty_applied = days_late * 50 
        fee.save()
            
            
import requests

def send_penalty_alert(student_name, phone, amount):
    # PDF Point 48: WhatsApp/SMS notification ready
    message = f"Hello, penalty of Rs.{amount} has been applied to {student_name}'s fee due to late payment."
    # API Integration yahan hogi
    print(f"DEBUG: Message sent to {phone}: {message}")
    return True




from datetime import date
from .models import Installment

def check_overdue_fees():
    # Aaj ki date se purani unpaid installments dhoondna
    overdue = Installment.objects.filter(due_date__lt=date.today(), is_paid=False)
    for item in overdue:
        # Example: ₹50 per day penalty
        days_late = (date.today() - item.due_date).days
        item.penalty_applied = days_late * 50 
        item.save()
        
        
        
        
        
from datetime import date
from .models import Installment
# WhatsApp Alert placeholder function

def run_fee_automation():
    overdue = Installment.objects.filter(due_date__lt=date.today(), is_paid=False)
    for item in overdue:
        days_late = (date.today() - item.due_date).days
        # Point 52: Rs. 50 daily penalty calculation
        item.penalty_applied = days_late * 50
        item.save()
        
        # Point 48: Automated Alert Trigger
        print(f"DEBUG: Alert sent to {item.student.phone} for late fee.")