# carform/serializers.py

from rest_framework import serializers
from carlistings.models import Car  # Assuming Car model is defined in carlistings app

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = '__all__'
