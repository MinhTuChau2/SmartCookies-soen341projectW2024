from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Reservation
import json
from django.core.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .serializers import ReservationSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])

def reserve_car(request):
    if request.method == 'GET':
        if request.user.is_superuser or request.user.email in ['SYSM@email.com', 'CSR@email.com']:
            reservations = Reservation.objects.all()  # Fetch all reservations
        else:
            reservations = Reservation.objects.filter(email=request.user.email)  # Filter by user's email

        reservation_data = [{
            'id': reservation.id,
            'carModel': reservation.car_model,
            'name': reservation.name,
            'email': reservation.email,
            'pickupDate': reservation.pickup_date,
            'returnDate': reservation.return_date
        } for reservation in reservations]

        return JsonResponse(reservation_data, safe=False)

    if request.method == 'POST':
        data = json.loads(request.body)

        try:
            reservation = Reservation(
                car_model=data['carModel'],
                name=data['name'],
                email=data['email'],
                pickup_date=data['pickupDate'],
                return_date=data['returnDate']
            )
            reservation.full_clean()  # This will call the clean method and raise ValidationError if any
            reservation.save()
            return JsonResponse({'message': 'Reservation successful'})

        except ValidationError as e:
            return JsonResponse({'error': str(e.message_dict)}, status=400)

    elif request.method == 'GET':
        # Filter reservations by the logged-in user
        reservations = Reservation.objects.filter(email=request.user.email)
        reservation_data = [{
            'id': reservation.id,
            'carModel': reservation.car_model,
            'name': reservation.name,
            'email': reservation.email,
            'pickupDate': reservation.pickup_date,
            'returnDate': reservation.return_date
        } for reservation in reservations]
        return JsonResponse(reservation_data, safe=False)

    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def reservation_detail(request, reservation_id):
    # Try to get the reservation by ID
    try:
        reservation = Reservation.objects.get(id=reservation_id)
    except Reservation.DoesNotExist:
        return Response({'error': 'Reservation not found'}, status=404)

    # Check if the request user is the owner of the reservation, a superuser, or a special user
    is_owner = request.user.email == reservation.email
    is_special_user = request.user.email in ['SYSM@email.com', 'CSR@email.com']
    can_modify = request.user.is_superuser or is_special_user

    if request.method == 'GET':
        # All authenticated users can view reservation details
        serializer = ReservationSerializer(reservation)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Only superusers, CSR, and SYSM can modify reservations
        if not can_modify:
            return Response({'error': 'Not authorized to update this reservation'}, status=403)
        serializer = ReservationSerializer(reservation, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
    # Allow superusers, SYSM, and CSR to delete reservations
        if not (request.user.is_superuser or is_special_user):
            return Response({'error': 'Not authorized to delete this reservation'}, status=403)
        reservation.delete()
        return Response(status=204)

    return Response({'error': 'Invalid request'}, status=400)
