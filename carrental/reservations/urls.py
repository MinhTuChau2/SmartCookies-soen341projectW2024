from django.urls import path
from .views import reserve_car
from .views import reserve_car, reservation_detail


urlpatterns = [
    #path('reservations/', reserve_car, name='reserve_car'),
    #path('reservations/', reserve_car, name='reserve_car'),
    path('reserve/', reserve_car, name='reserve_car'),
    path('reservations/reservation/<int:reservation_id>/', reservation_detail, name='reservation_detail'),
]

