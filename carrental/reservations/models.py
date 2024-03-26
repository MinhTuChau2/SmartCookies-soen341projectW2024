from django.db import models
from django.forms import ValidationError
from cars.models import Car 

# Create your models here.

class Reservation(models.Model):
    car_model = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    pickup_date = models.DateField()
    return_date = models.DateField()
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('agreement_sent', 'Agreement Sent'),
        ('agreement_signed', 'Agreement Signed'),
        ('under_review', 'Under Review'),
        ('accepted', 'Accepted'),
        ('payment_pending', 'Payment Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')


    def clean(self):
        overlapping_reservations = Reservation.objects.filter(
            car_model=self.car_model,
            pickup_date__lte=self.return_date,
            return_date__gte=self.pickup_date
        ).exclude(id=self.id)  # Exclude the current instance to allow updates

        if overlapping_reservations.exists():
            raise ValidationError('This car is already reserved for the given dates.')

    class Meta:
        app_label = 'reservations'