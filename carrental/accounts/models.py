from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)  # Ensure email is unique

    # If you have any other custom fields, they can go here

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Note: 'email' is not required here as it's the USERNAME_FIELD
