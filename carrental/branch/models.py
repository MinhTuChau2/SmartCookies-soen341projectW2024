from django.db import models
from cars.models import Car

class Branch(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    cars = models.ManyToManyField(Car, related_name='branches')

    def __str__(self):
        return self.name
