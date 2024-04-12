from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .models import BankAccount, Transaction
from django.shortcuts import get_object_or_404
from reservations.models import Reservation  
from decimal import Decimal
from cars.models import Car
from django.contrib.auth import get_user_model
from rest_framework.response import Response
import datetime




INSURANCE_COST = Decimal('30.00')
GPS_COST = Decimal('15.00')
CAR_SEAT_COST = Decimal('10.00') 

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def handle_payment(request, reservation_id):
    reservation = get_object_or_404(Reservation, id=reservation_id)

    if reservation.status not in ['accepted', 'payment_pending']:
        return JsonResponse({'error': 'Invalid reservation status for payment.'}, status=400)

    try:
        car = Car.objects.get(model=reservation.car_model)
    except Car.DoesNotExist:
        return JsonResponse({'error': 'Car model not found.'}, status=400)

    num_days = (reservation.return_date - reservation.pickup_date).days + 1
    rental_cost = car.price * Decimal(num_days)

    insurance = request.data.get('insurance', False)
    gps = request.data.get('gps', False)
    car_seat = int(request.data.get('car_seat', 0))

    if insurance:
        rental_cost += INSURANCE_COST * Decimal(num_days)
    if gps:
        rental_cost += GPS_COST * Decimal(num_days)
    if car_seat > 0:
        rental_cost += CAR_SEAT_COST * Decimal(num_days) * Decimal(car_seat)

    # Adjusting the rental cost with the discount amount directly
    rental_cost -= reservation.discountAmount

    deposit = Decimal('500')
    total_cost = rental_cost + deposit

    customer_account = request.user.bank_account
    # Make payment is only called once, which is sufficient to deduct the amount
    if customer_account.make_payment(total_cost):
        
        Transaction.objects.create(
            user=request.user,
            amount=-total_cost,
            transaction_type='payment',
            transaction_date=datetime.datetime.now(),
            description=f'Payment for reservation {reservation_id}'
        )
        reservation.status = 'completed'
        reservation.save()
        return JsonResponse({'message': 'Payment successful'}, status=200)
    else:
        return JsonResponse({'error': 'Insufficient funds.'}, status=400)


# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def handle_reimbursement(request, reservation_id):
#     get_object_or_404(Reservation, id=reservation_id)  # Ensure reservation exists
#     bank_account = request.user.bank_account
#     bank_account.reimburse(Decimal(500))  # Refund deposit
#     return JsonResponse({'message': 'Deposit reimbursed'}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def handle_reimbursement(request, reservation_id):
    # Ensure reservation exists
    reservation=get_object_or_404(Reservation, id=reservation_id)

    # Identify the rental company's user and bank account
    User = get_user_model()
    rental_company_user = User.objects.get(email='rentalcompany@email.com')
    rental_company_account = BankAccount.objects.get(user=rental_company_user)

    # Identify the current user's bank account for reimbursement
    user_bank_account = request.user.bank_account

    # Check if the rental company has enough balance for the reimbursement
    if rental_company_account.balance >= Decimal(500):
        # Transfer $500 from the rental company's account to the user's account
        rental_company_account.balance -= Decimal(500)
        user_bank_account.balance += Decimal(500)
        
        # Save the updated account balances
        rental_company_account.save()
        user_bank_account.save()

        reservation.status = 'Finished'
        reservation.save()
        
        Transaction.objects.create(
            user=request.user,
            amount=Decimal(500),
            transaction_type='reimbursement',
            transaction_date=datetime.datetime.now(),
            description=f'Reimbursement for reservation {reservation_id}'
        )

        reservation.status = 'Finished'
        reservation.save()
        return JsonResponse({'message': 'Deposit reimbursed'}, status=200)
    else:
        return JsonResponse({'error': 'Insufficient funds for reimbursement'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_bank_account_by_email(request):
    user_email = request.GET.get('email')
    if not user_email:
        return Response({'error': 'Email query parameter is required.'}, status=400)

    User = get_user_model()
    try:
        user = User.objects.get(email=user_email)
        bank_account = BankAccount.objects.get(user=user)
        return Response({'creditCardNumber': bank_account.credit_card_number})
    except (User.DoesNotExist, BankAccount.DoesNotExist):
        return Response({'error': 'Bank account not found for the given email.'}, status=404)
