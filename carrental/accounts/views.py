from rest_framework import generics
from django.views.decorators.csrf import csrf_exempt 
from .serializers import UserRegistrationSerializer
from django.contrib.auth import get_user_model
from rest_framework.authtoken.views import ObtainAuthToken
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import CustomUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, get_user_model
User = get_user_model()

from rest_framework import generics
from .serializers import UserRegistrationSerializer
from rest_framework.permissions import AllowAny  # Import AllowAny

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]  # Override the global permission class here

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            try:
                user = serializer.save()
                return Response({
                    "user_id": user.pk,
                    "email": user.email,
                    "username": user.username,
                    "points": user.points 
                }, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                return Response({"error": "A user with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        # Check if both email and password are provided
        if email is None or password is None:
            return Response({'error': 'Please provide both email and password.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Check if the email exists in the database
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # If the user does not exist, return a specific error message
            return Response({'error': 'User does not exist. Please sign up.'},
                            status=status.HTTP_404_NOT_FOUND)

        # Authenticate the user
        user = authenticate(request, username=email, password=password)

        if user is not None:
            if user.is_active:
                # User is authenticated and active, create or get the token
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'user_id': user.pk,
                    'email': user.email,
                    'username': user.username,
                    'is_superuser': user.is_superuser
                }, status=status.HTTP_200_OK)
            else:
                # User is authenticated but not active
                return Response({'error': 'This account is inactive.'},
                                status=status.HTTP_403_FORBIDDEN)
        else:
            # Authentication failed due to invalid credentials
            return Response({'error': 'Invalid email or password.'},
                            status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        return JsonResponse({
            'username': request.user.username,
            # Include any other user fields you might need
        })
    

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_points(request):
    if request.method == 'POST':
        data = request.data
        email = data.get('email')
        points = data.get('points')

        # Validate data
        if not email or not points:
            return JsonResponse({'error': 'Both email and points are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
            user.points += int(points)
            user.save()
            return JsonResponse({'message': 'Points updated successfully'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValueError:
            return JsonResponse({'error': 'Invalid points value'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)