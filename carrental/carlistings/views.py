from django.shortcuts import render
from .models import Car

def car_listing(request):
    cars = Car.objects.all()
    return render(request, 'carlistings/car_listing.html', {'carlistings': cars})
