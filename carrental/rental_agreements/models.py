from django.db import models
from django.conf import settings

class RentalAgreement(models.Model):
    reservation = models.OneToOneField('reservations.Reservation', on_delete=models.CASCADE, related_name='rental_agreement')

    agreement_file = models.FileField(upload_to='rental_agreements/')
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending')
    rejection_reason = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Agreement for {self.reservation}"
