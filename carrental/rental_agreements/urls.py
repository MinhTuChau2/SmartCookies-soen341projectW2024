from django.urls import path
from .views import generate_rental_agreement

urlpatterns = [
    path('agreement/<int:reservation_id>/', generate_rental_agreement, name='generate_rental_agreement'),
]
