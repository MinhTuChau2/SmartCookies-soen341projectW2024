from django.urls import path
from .views import handle_payment, handle_reimbursement

urlpatterns = [
    path('payment/<int:reservation_id>/', handle_payment, name='handle_payment'),
    path('reimbursement/<int:reservation_id>/', handle_reimbursement, name='handle_reimbursement'),
]
