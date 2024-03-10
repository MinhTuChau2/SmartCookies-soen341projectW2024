from django.shortcuts import render

# Create your views here.

# reservations/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Reservation
import json

@csrf_exempt
def reserve_car(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        reservation = Reservation.objects.create(
            car_id=data['car_id'],
            car_type=data['carType'],
            name=data['name'],
            email=data['email'],
            pickup_date=data['pickupDate'],
            return_date=data['returnDate']
        )
        return JsonResponse({'message': 'Reservation successful'})
    else:
        return JsonResponse({'error': 'Invalid request method'})
