from django.urls import path
from .views import add_car


urlpatterns = [
    #path('reservations/', reserve_car, name='reserve_car'),
    #path('reservations/', reserve_car, name='reserve_car'),
    path('addcar/', add_car, name='add_car'),
] 