from django.urls import path
from .views import FeeAPI, StudentFeeLedgerAPI, download_fee_csv , fee_summary # Ise import karein

urlpatterns = [
    path("", FeeAPI.as_view()),
    path("my-ledger/", StudentFeeLedgerAPI.as_view()),
    path("download-report/", download_fee_csv), # Ise register karein (Point 65)
    
    # ✅ Ye wo line hai jo Dashboard ka 404 fix karegi
    path('summary/', fee_summary, name='fee-summary'),
]