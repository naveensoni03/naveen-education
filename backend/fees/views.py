from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from .models import FeePlan, Installment, FeeTransaction
from students.models import Student

class FeeAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        transactions = FeeTransaction.objects.all()
        data = [{"id": t.id, "student": t.student.name, "amount": t.amount_paid, "date": t.payment_date} for t in transactions]
        return Response(data)

class StudentFeeLedgerAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            student_profile = Student.objects.get(email=request.user.email)
            installments = Installment.objects.filter(student=student_profile)
            
            total_due = installments.filter(is_paid=False).aggregate(Sum('amount'))['amount__sum'] or 0
            total_paid = FeeTransaction.objects.filter(student=student_profile).aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
            
            return Response({
                "student_name": student_profile.name,
                "ledger": [
                    {
                        "id": i.id, 
                        "amount": i.amount, 
                        "due_date": i.due_date, 
                        "status": i.is_paid,
                        "penalty": i.penalty_applied 
                    } for i in installments
                ],
                "summary": {
                    "total_paid": total_paid,
                    "outstanding_balance": total_due
                }
            })
        except Student.DoesNotExist:
            return Response({"error": "Student record not found"}, status=404)
        
        
        
        
        
import csv
from django.http import HttpResponse

def download_fee_csv(request):
    # CSV generation for reports (Point 65)
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="fee_report.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Student', 'Paid', 'Outstanding'])
    # logic to fetch and write data...
    return response




# backend/fees/views.py ke end mein add karein

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def fee_summary(request):
    """Dashboard ke liye Total Fees calculate karega"""
    # Real calculation from DB
    total_collected = FeeTransaction.objects.aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
    
    # Total assigned fee minus total paid = Pending
    total_assigned = Installment.objects.aggregate(Sum('amount'))['amount__sum'] or 0
    total_pending = total_assigned - total_collected

    return Response({
        'collected': total_collected,
        'pending': total_pending
    })