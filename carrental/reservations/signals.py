# reservations/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Reservation
from accounts.models import CustomUser

@receiver(post_save, sender=Reservation)
def update_user_points(sender, instance, **kwargs):
    if instance.status in ['completed']:
        try:
            user = CustomUser.objects.get(email=instance.email)
            user.points += 10  # Assuming 10 points are added for each completed reservation
            user.save()
        except CustomUser.DoesNotExist:
            pass  # Handle the case where the user does not exist, if necessary
