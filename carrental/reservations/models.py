from django.db import models

# Create your models here.

class Reservation(models.Model):
    car_id = models.IntegerField()
    car_type = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    pickup_date = models.DateField()
    return_date = models.DateField()

    class Meta:
        app_label = 'reservations'