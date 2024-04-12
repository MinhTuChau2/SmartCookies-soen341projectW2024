from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.crypto import get_random_string

class BankAccount(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bank_account')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=1000)
    credit_card_number = models.CharField(max_length=16)

    def save(self, *args, **kwargs):
        if not self.credit_card_number:
            # Generate a pseudo credit card number
            base_part = self.user.username[:8]  # Take up to the first 8 characters of the username
            unique_part = get_random_string(length=8, allowed_chars='0123456789')
            self.credit_card_number = base_part.ljust(8, 'X') + unique_part  # Pad base_part with 'X' to ensure it's 8 chars long
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username}'s bank account"

    def make_payment(self, amount):
        if self.balance >= amount:
            self.balance -= amount
            self.save()
            Transaction.objects.create(user=self.user, amount=-amount, transaction_type='payment', transaction_date=timezone.now())
            return True
        return False

    def reimburse(self, amount):
        self.balance += amount
        self.save()
        Transaction.objects.create(user=self.user, amount=amount, transaction_type='reimbursement', transaction_date=timezone.now())


from django.db import models
from django.conf import settings

class Transaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=20, choices=(('payment', 'Payment'), ('reimbursement', 'Reimbursement')))
    transaction_date = models.DateTimeField()
    description = models.TextField(null=True, blank=True)  # Optional description field

    def __str__(self):
        return f"Transaction {self.transaction_type} of {self.amount} on {self.transaction_date.strftime('%Y-%m-%d %H:%M')} by {self.user.username}"
