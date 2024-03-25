from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .models import BankAccount, Transaction
from django.shortcuts import get_object_or_404
from reservations.models import Reservation  
from decimal import Decimal
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def handle_payment(request, reservation_id):
    reservation = get_object_or_404(Reservation, id=reservation_id)
    car = reservation.car
    num_days = (reservation.return_date - reservation.pickup_date).days
    total_cost = car.price * Decimal(num_days) + Decimal(500)  # Including deposit

    bank_account = request.user.bank_account
    if bank_account.make_payment(total_cost):
        return JsonResponse({'message': 'Payment successful'}, status=200)
    else:
        return JsonResponse({'error': 'Insufficient funds'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def handle_reimbursement(request, reservation_id):
    get_object_or_404(Reservation, id=reservation_id)  # Ensure reservation exists
    bank_account = request.user.bank_account
    bank_account.reimburse(Decimal(500))  # Refund deposit
    return JsonResponse({'message': 'Deposit reimbursed'}, status=200)
