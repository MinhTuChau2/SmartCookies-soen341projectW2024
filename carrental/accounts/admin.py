from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser  # Import your custom user model

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'points', 'is_staff', 'is_active')  # Include 'points' here

# Register your custom user model with the Django admin
admin.site.register(CustomUser, UserAdmin)
