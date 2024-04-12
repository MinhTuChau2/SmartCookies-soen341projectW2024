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
    insurance = models.BooleanField(default=False)
    gps = models.BooleanField(default=False)
    car_seat_count = models.IntegerField(default=0)
    discountAmount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    def calculate_additional_costs(self):
        INSURANCE_COST = 30.00
        GPS_COST = 15.00
        CAR_SEAT_COST = 10.00

        cost = 0.00
        if self.insurance:
            cost += INSURANCE_COST
        if self.gps:
            cost += GPS_COST
        cost += self.car_seat_count * CAR_SEAT_COST

        return cost
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('agreement_sent', 'Agreement Sent'),
        ('agreement_signed', 'Agreement Signed'),
        ('under_review', 'Under Review'),
        ('accepted', 'Accepted'),
        ('payment_pending', 'Payment Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('car_received', 'Car received'),
        ('Finish', 'Finish')
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