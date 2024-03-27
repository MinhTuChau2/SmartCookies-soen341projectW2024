# rental_agreements/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps


@receiver(post_save, sender='rental_agreements.RentalAgreement')
def update_reservation_status(sender, instance, **kwargs):
    Reservation = apps.get_model('reservations', 'Reservation')
    # Assuming 'instance' is your RentalAgreement instance

    # Map RentalAgreement status to Reservation status
    status_mapping = {
        'pending': 'agreement_sent',
        'under_review': 'under_review',
        'accepted': 'accepted',
        'rejected': 'cancelled',
    }

    reservation_status = status_mapping.get(instance.status)
    if reservation_status:
        instance.reservation.status = reservation_status
        instance.reservation.save()
