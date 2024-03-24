# urls.py

from django.urls import path
from .views import CarDetailView

urlpatterns = [
    # Other URL patterns...
    path('cars/<int:pk>/', CarDetailView.as_view(), name='car-detail'),
]
