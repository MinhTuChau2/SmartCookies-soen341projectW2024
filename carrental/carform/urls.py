from django.urls import path
from .views import add_car

urlpatterns = [
    path('api/add_car/', add_car, name='add_car'),
]
