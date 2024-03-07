from django.contrib.auth import authenticate, login
from django.contrib.admin.views.decorators import staff_member_required
import json
from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from properties.models import Property
from .forms import SignUpForm, UserUpdateForm, LoginForm
from .models import CustomUser
from django.core.mail import send_mail


@csrf_exempt
def user_login(request):
    """
    Handle user login.
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        user = get_user_model()
        form = LoginForm(data)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']

            user = authenticate(request, email=email, password=password)

            if user is not None:
                login(request, user)
                if user.is_superuser:
                    return redirect('admin:index')  # Redirect superuser to admin index
                else:
                    return JsonResponse({
                        "message": "User was logged in successfully",
                        "id": user.id,
                        "name": user.name,
                        "role": user.role,
                        "email": user.email,
                        "phoneNumber": user.phone_number
                    })
            return JsonResponse({"error": "Invalid email or password"}, status=400)

        return JsonResponse({"error": form.errors}, status=400)

    form = LoginForm()
    return render(request, 'login.html', {'form': form})


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_obj = get_user_model()
        form = SignUpForm(data)
        if form.is_valid():
            email = form.cleaned_data['email']
            name = form.cleaned_data['name']
            phone_number = form.cleaned_data['phone_number']
            role = form.cleaned_data['role']
            password = form.cleaned_data['password']
            password_confirmation = form.cleaned_data['password_confirmation']

            if password != password_confirmation:
                return JsonResponse({"error": "Passwords do not match"}, status=400)

            try:
                user_obj.objects.create_user(
                    email=email,
                    name=name,
                    phone_number=phone_number,
                    role=role,
                    password=password
                )
                return JsonResponse({"message": "User was registered successfully"})
            except ValidationError as e:
                return JsonResponse({"error": str(e)}, status=400)
        else:
            return JsonResponse({"error": form.errors}, status=400)
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})


@csrf_exempt
def user_logout(request):

    if request.method == 'POST':
        logout(request)
        return JsonResponse({'message': 'Logged out successfully'}, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=400)