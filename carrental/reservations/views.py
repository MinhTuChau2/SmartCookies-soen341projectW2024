from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Reservation
import json
from django.core.exceptions import ValidationError

@csrf_exempt
def reserve_car(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        

        try:
            reservation = Reservation(
                car_model=data['carModel'],
                name=data['name'],
                email=data['email'],
                pickup_date=data['pickupDate'],
                return_date=data['returnDate']
            )
            reservation.full_clean()  # This will call the clean method and raise ValidationError if any
            reservation.save()
            return JsonResponse({'message': 'Reservation successful'})

        except ValidationError as e:
            return JsonResponse({'error': str(e.message_dict)}, status=400)

    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
