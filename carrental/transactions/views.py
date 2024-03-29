from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .models import BankAccount, Transaction
from django.shortcuts import get_object_or_404
from reservations.models import Reservation  
from decimal import Decimal
from cars.models import Car
from django.contrib.auth import get_user_model

INSURANCE_COST = Decimal('30.00')
GPS_COST = Decimal('15.00')
CAR_SEAT_COST = Decimal('10.00')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def handle_payment(request, reservation_id):
    reservation = get_object_or_404(Reservation, id=reservation_id)

    # Ensure the reservation is either 'accepted' or 'payment_pending'
    if reservation.status not in ['accepted', 'payment_pending']:
        return JsonResponse({'error': 'Invalid reservation status for payment.'}, status=400)

    # Fetch the car associated with the reservation
    try:
        car = Car.objects.get(model=reservation.car_model)
    except Car.DoesNotExist:
        return JsonResponse({'error': 'Car model not found.'}, status=400)

    # Calculate the total cost and the deposit
    num_days = (reservation.return_date - reservation.pickup_date).days
    rental_cost = car.price * Decimal(num_days)

    # Additional costs
    insurance = request.data.get('insurance', False)  # Check if insurance is included in the request
    gps = request.data.get('gps', False)  # Assuming GPS is also optional and passed in the request
    car_seat = int(request.data.get('car_seat', 0))  # Assuming car_seat is optional and passed in the request

    if insurance:
        rental_cost += INSURANCE_COST * Decimal(num_days)
    if gps:
        rental_cost += GPS_COST * Decimal(num_days)
    if car_seat > 0:
        rental_cost += CAR_SEAT_COST * Decimal(num_days) * Decimal(car_seat)
    
    deposit = Decimal(500)
    total_cost = rental_cost + deposit

    # Process the payment from the customer's account
    customer_account = request.user.bank_account
    if not customer_account.make_payment(total_cost):
        return JsonResponse({'error': 'Insufficient funds.'}, status=400)

    # Transfer the rental cost to the rental company's account
    User = get_user_model()
    rental_company_user = User.objects.get(email='rentalcompany@email.com')
    rental_company_account = BankAccount.objects.get(user=rental_company_user)
    rental_company_account.balance += total_cost
    rental_company_account.save()

    # Update the reservation status to 'completed'
    reservation.status = 'completed'
    reservation.save()

    return JsonResponse({'message': 'Payment successful, and $500 deposit deducted.'}, status=200)


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
    get_object_or_404(Reservation, id=reservation_id)

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

        # Optionally, create transaction records for both accounts here

        return JsonResponse({'message': 'Deposit reimbursed from rental company'}, status=200)
    else:
        return JsonResponse({'error': 'Rental company does not have sufficient funds for reimbursement'}, status=400)
