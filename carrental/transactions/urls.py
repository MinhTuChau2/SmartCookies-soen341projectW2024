from django.urls import path
from .views import handle_payment, handle_reimbursement,get_bank_account_by_email

urlpatterns = [
    path('payment/<int:reservation_id>/', handle_payment, name='handle_payment'),
    path('reimbursement/<int:reservation_id>/', handle_reimbursement, name='handle_reimbursement'),
    path('bank-account/',get_bank_account_by_email, name='get_bank_account_by_email'),
]
