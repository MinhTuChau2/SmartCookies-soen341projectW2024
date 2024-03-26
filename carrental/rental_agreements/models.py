from django.db import models
from django.conf import settings
from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
from reservations.models import Reservation


class RentalAgreement(models.Model):
    reservation = models.OneToOneField('reservations.Reservation', related_name='rental_agreement', on_delete=models.CASCADE)
    signed_agreement = models.FileField(upload_to='signed_agreements/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('under_review', 'Under Review'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending')

    def __str__(self):
        return f"Agreement for reservation {self.reservation.id}"
    
@receiver(post_delete, sender=Reservation)
def delete_related_agreement(sender, instance, **kwargs):
    if hasattr(instance, 'rental_agreement'):
        instance.rental_agreement.delete()