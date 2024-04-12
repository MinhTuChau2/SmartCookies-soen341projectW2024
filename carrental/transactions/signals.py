from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Transaction
from accounts.models import CustomUser

@receiver(post_save, sender=Transaction)
def update_user_points(sender, instance, created, **kwargs):
    if created and instance.transaction_type == 'payment' and instance.points_used > 0:
        user = instance.user
        user.points -= instance.points_used  # Deduct points
        user.save()
