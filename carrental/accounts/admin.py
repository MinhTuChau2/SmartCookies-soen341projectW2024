from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser  # Import your custom user model

# Register your custom user model with the Django admin
admin.site.register(CustomUser, UserAdmin)
