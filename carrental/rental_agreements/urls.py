from django.urls import path
from .views import generate_rental_agreement,email_reception


urlpatterns = [
    path('agreement/<int:reservation_id>/', generate_rental_agreement, name='generate_rental_agreement'),
    path('agreement/email-reception/', email_reception, name='email_reception'),

]
