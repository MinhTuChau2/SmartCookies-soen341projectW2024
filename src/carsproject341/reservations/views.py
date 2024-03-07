
import json
from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from properties.models import Property
from .forms import SignUpForm, UserUpdateForm, LoginForm
from .models import Broker, CustomUser
from django.core.mail import send_mail


@csrf_exempt
def signup(request):
    """
    Handle user registration.
    """
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
def custom_login(request):
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
                return JsonResponse({"message": "User was logged in successfully",
                                     "id": user.id,
                                     "name": user.name,
                                     "role": user.role,
                                     "email": user.email,
                                     "phoneNumber": user.phone_number})
            return JsonResponse({"error": "Invalid email or password"}, status=400)

        return JsonResponse({"error": form.errors}, status=400)

    form = LoginForm()
    return render(request, 'login.html', {'form': form})


def user_list(request):
    """
    Display a list of users.
    """
    users = CustomUser.objects.all()
    return render(request, 'user_list.html', {'users': users})


def user_detail(request, user_id):
    """
    Display details of a specific user and return a JSON response.
    """
    user = get_object_or_404(CustomUser, id=user_id)
    user_data = model_to_dict(user)
    return JsonResponse({'user': user_data})


def create_user(request):
    """
    Create a new user and return a JSON response.
    """
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()

            # Convert the user object to a dictionary for the JSON response
            user_data = model_to_dict(user)
            return JsonResponse({'message': 'User created successfully', 'user': user_data})
        else:
            return JsonResponse({'error': 'Invalid form data'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


def update_user(request, user_id):
    """
    Update an existing user and return a JSON response.
    """
    user = get_object_or_404(CustomUser, id=user_id)

    if request.method == 'POST':
        form = UserUpdateForm(request.POST, instance=user)
        if form.is_valid():
            form.save()

            # Convert the updated user object to a dictionary for the JSON response
            updated_user_data = model_to_dict(CustomUser.objects.get(id=user_id))
            return JsonResponse({'message': 'User updated successfully', 'user': updated_user_data})
        else:
            return JsonResponse({'error': 'Invalid form data'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


def delete_user(request, user_id):
    """
    Delete an existing user and return a JSON response.
    """
    user = get_object_or_404(CustomUser, id=user_id)
    user.delete()
    return JsonResponse({'message': 'User deleted successfully'})


@csrf_exempt
def search_brokers(request):
    """
    Search for brokers based on the provided query.
    """
    if request.method == 'POST' or request.method == 'GET':
        data = json.loads(request.body) if request.method == 'POST' else request.GET.dict()
        brokers = CustomUser.objects.filter(role="broker")

        if data:
            brokers = brokers.filter(name=data.get('name'))

        serialized_brokers = []

        for broker in brokers:
            serialized_broker = {
                "name": broker.name,
                "email": broker.email,
                "phone_number": broker.phone_number
            }

            serialized_brokers.append(serialized_broker)

        return JsonResponse(serialized_brokers, safe=False)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


def request_info(request, broker_id):
    """
    Handle a request for information about a broker.
    """
    broker = get_object_or_404(Broker, id=broker_id)
    # Handle the request (send email, save to database, etc.)
    # Add your logic here...
    return render(request, 'request_info.html', {'broker': broker})


@csrf_exempt
def request_visit(request, broker_id):
    """
    Handle a request to visit a property and send an email to the broker.
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        broker_id_from_payload = data.get('brokerId')
        user_id = data.get('userId')  # Retrieve user ID from the request body

        if broker_id_from_payload == broker_id and user_id:
            broker = get_object_or_404(CustomUser, id=broker_id)

            # Get the currently logged-in user using the user ID
            user_log = get_object_or_404(CustomUser, id=user_id)
            print(user_log.id)

            # Send an email to the broker
            subject = 'Visit Request for Property'
            message = f'Dear {broker.name},\n\n{user_log.name} has requested a visit for a property. Please contact them to arrange the visit.'
            from_email = user_log.email  # Set your email address
            to_email = [broker.email]  # Use the broker's email address

            send_mail(subject, message, from_email, to_email, fail_silently=False)

            return JsonResponse({'message': 'Visit request sent successfully'})
        else:
            return JsonResponse({'error': 'Broker ID or user ID mismatch'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


# def broker_property_listings(request, broker_id):
#     """
#     Display property listings for a specific broker.
#     """
#     broker = get_object_or_404(CustomUser, id=broker_id)
#     properties = Property.objects.filter(assigned_user=broker)
#     return render(request,
#                   'broker_property_listings.html',
#                   {'broker': broker,
#                    'properties': properties}
#                   )

@csrf_exempt
def broker_property_listings(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print(f"data is {data}")
        broker_id = data.get('brokerID')
        print(broker_id)

        try:
            # Assuming 'assigned_user' field in Property model refers to the broker
            properties = Property.objects.filter(assigned_user_id=broker_id)
            # print(f"Number of properties associated with broker {broker_id}: {properties.count()}")
            # print(f"searching for broker with {broker_id}")
            props = Property.objects.all()
            prop_count = props.count()
            # print(f"Total number of properties: {prop_count}")

            # Serializing property data to JSON response
            properties_list = [
                {
                    "property_id": property_obj.property_id,
                    "price": str(property_obj.price),
                    "city": property_obj.city,
                    # Add other property fields you want to include
                }
                for property_obj in properties
            ]

            return JsonResponse(properties_list, safe=False)

        except Property.DoesNotExist:
            # return JsonResponse({'error': 'Properties not found for the given broker ID'}, status=404)
            return JsonResponse([], safe=False)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


def profile_view(request):
    """
    Display the profile of the currently logged-in user.
    """
    user = request.user
    return render(request, 'profile.html', {'user': user})


def index(request):
    """
    Display the index page.
    """
    return render(request, 'index.html')


@csrf_exempt
def custom_logout(request):
    """
    Handle user logout.
    """
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'message': 'Logged out successfully'}, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=400)