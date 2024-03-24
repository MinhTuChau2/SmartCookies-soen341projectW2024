<<<<<<< HEAD
# urls.py

from django.urls import path
from .views import CarDetailView

urlpatterns = [
    # Other URL patterns...
    path('cars/<int:pk>/', CarDetailView.as_view(), name='car-detail'),
=======
from django.urls import path
from .views import CarView

urlpatterns = [
    path('cars/', CarView.as_view(), name='cars'),  # Use as_view() for class-based views
>>>>>>> 3336b07ecef0d5d726364043ec84408042ef8c0e
]
