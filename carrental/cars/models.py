from django.db import models

class Car(models.Model):
    maker = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='car_images', default='default_car_image.jpg')  # Added ImageField for storing car images
    address = models.CharField(max_length=255)
    car_type = models.CharField(max_length=100)
