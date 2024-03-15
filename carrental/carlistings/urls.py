from django.urls import path
from .views import car_listing

urlpatterns = [
    path('carlistings', car_listing, name='car_listing'),
]
