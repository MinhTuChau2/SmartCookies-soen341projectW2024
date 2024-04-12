from decimal import Decimal
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
    points_used = models.IntegerField(default=0, help_text="Points used for the reservation")
    
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

    def calculate_discount(self):
        # Get the total cost before discount
        total_cost = self.calculate_total_cost()
        # Calculate the discount factor from points used
        discount_factor = Decimal(self.points_used // 50) * Decimal('0.10')  # 10% for every 50 points
        # Ensure that the maximum discount does not exceed 50%
        max_discount_factor = min(discount_factor, Decimal('0.50'))
        # Calculate the discount amount
        discount_amount = total_cost * max_discount_factor
        return discount_amount

    def calculate_additional_costs(self):
        INSURANCE_COST = Decimal('30.00')
        GPS_COST = Decimal('15.00')
        CAR_SEAT_COST = Decimal('10.00')

        cost = Decimal('0.00')
        if self.insurance:
            cost += INSURANCE_COST * (self.return_date - self.pickup_date).days
        if self.gps:
            cost += GPS_COST * (self.return_date - self.pickup_date).days
        cost += self.car_seat_count * CAR_SEAT_COST * (self.return_date - self.pickup_date).days

        return cost
    
    def calculate_total_cost(self):
        days = (self.return_date - self.pickup_date).days + 1
        car = Car.objects.get(model=self.car_model)
        base_cost = car.price * days
        return base_cost + self.calculate_additional_costs() - self.discountAmount

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