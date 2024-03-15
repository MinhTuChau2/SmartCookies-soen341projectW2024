from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from .models import Car
import json

@csrf_exempt
def add_car(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        car = Car.objects.create(
            maker=data['maker'],
            model=data['model'],
            year=data['year'],
            price=data['price'],
            available=data['available'],
            image=data['image'],
            position_lat=data['position_lat'],
            position_lng=data['position_lng'],
            car_type=data['car_type']
        )
        # Redirect the user to the Django admin car listing page
        return redirect('/admin/carlistings/car/')
    else:
        return JsonResponse({'error': 'Invalid request method'})
