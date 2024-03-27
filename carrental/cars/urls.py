from django.urls import path
from . import views

urlpatterns = [
    # URL for listing all cars and creating a new car
    path('cars/', views.CarView.as_view(), name='car-list'),

    # URL for deleting a specific car
    path('cars/<str:model>/', views.CarView.as_view(), name='car-detail'),
]
