from django.contrib import admin
from .models import Car  # Corrected import statement

admin.site.register(Car)  # Register the Car model with the admin site
