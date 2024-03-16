from rest_framework import serializers
from .models import *

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = ['maker', 'model', 'year', 'price', 'available','image', 'address', 'car_type']
