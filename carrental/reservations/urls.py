from django.urls import path
from .views import reserve_car


urlpatterns = [
    path('reservations/', reserve_car, name='reserve_car'),
  
] 