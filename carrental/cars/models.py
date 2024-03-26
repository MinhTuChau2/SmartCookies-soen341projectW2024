from django.db import models
from django.utils.translation import gettext_lazy as _
from django.forms import ValidationError

class Car(models.Model):
    maker = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='car_images', default='default_car_image.jpg')
    address = models.CharField(max_length=255)
    car_type = models.CharField(max_length=100)

class DamageReport(models.Model):
    car = models.ForeignKey('Car', on_delete=models.CASCADE)
    description = models.TextField(_('description'))
    reported_at = models.DateTimeField(_('reported at'), auto_now_add=True)

    class Meta:
        verbose_name = _('damage report')
        verbose_name_plural = _('damage reports')

    def __str__(self):
        return f"Damage Report for {self.car} - {self.reported_at.strftime('%Y-%m-%d %H:%M:%S')}"