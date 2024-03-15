# carform/forms.py

from django import forms
from carlistings.models import Car

class CarForm(forms.ModelForm):
    class Meta:
        model = Car
        fields = ['maker', 'model', 'year', 'price', 'available', 'image', 'position_lat', 'position_lng', 'car_type']
