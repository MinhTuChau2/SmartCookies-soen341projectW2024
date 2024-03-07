
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model

class SignUpForm(UserCreationForm):
    email = forms.EmailField(required=True)
    name = forms.CharField(required=True)
    phone_number = forms.CharField(required=True)
    role = forms.CharField(required=True)

    class Meta:
        model = get_user_model()
        fields = ('email', 'name', 'phone_number', 'role', 'password1', 'password2')

class LoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)
