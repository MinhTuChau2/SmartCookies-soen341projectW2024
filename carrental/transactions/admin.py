# transactions/admin.py
from django.contrib import admin
from .models import BankAccount, Transaction

admin.site.register(BankAccount)
admin.site.register(Transaction)
