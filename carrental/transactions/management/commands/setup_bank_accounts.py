from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from transactions.models import BankAccount

class Command(BaseCommand):
    help = 'Sets up bank accounts for all users with a predefined balance, excluding specified users and superusers.'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        excluded_emails = ['SYSM@email.com', 'CSR@email.com']
        predefined_balance = 1000

        for user in User.objects.exclude(email__in=excluded_emails).exclude(is_superuser=True):
            BankAccount.objects.get_or_create(
                user=user,
                defaults={'balance': predefined_balance}  # Ensure this field matches your model
            )

        self.stdout.write(self.style.SUCCESS('Successfully set up bank accounts.'))
