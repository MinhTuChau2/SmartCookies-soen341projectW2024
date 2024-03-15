from django.db import models

class Car(models.Model):
    maker = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='car_images')
    position_lat = models.FloatField()
    position_lng = models.FloatField()
    car_type = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.year} {self.maker} {self.model}"
