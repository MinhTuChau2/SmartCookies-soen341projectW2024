from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from reservations.models import Reservation
import json
from django.core.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from reservations.serializers import ReservationSerializer
from rental_agreements.views import send_rental_agreement

from django.core.files.base import ContentFile




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
            'returnDate': reservation.return_date,
            'status': reservation.status 
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
                return_date=data['returnDate'],
                
            )
            reservation.full_clean()  # This will call the clean method and raise ValidationError if any
            reservation.save()

            # Send the rental agreement email after successful reservation
            send_rental_agreement(request,reservation.id)

            # Update the reservation status to indicate that the agreement has been sent
            reservation.status = 'agreement_sent'
            reservation.save()

            return JsonResponse({'message': 'Reservation successful and rental agreement sent'})

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
    can_modify = request.user.is_superuser or is_special_user or is_owner

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
            reservation.status = 'agreement_sent'
            serializer.save()
            send_rental_agreement(request, reservation.id)  # Resend rental agreement
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
    # Allow superusers, SYSM, and CSR to delete reservations
        if not (request.user.is_superuser or is_special_user or is_owner):
            return Response({'error': 'Not authorized to delete this reservation'}, status=403)
        reservation.delete()
        return Response(status=204)

    return Response({'error': 'Invalid request'}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_reservation_status(request, reservation_id):
    # Retrieve the reservation object, or return a 404 response if not found
    reservation = get_object_or_404(Reservation, id=reservation_id)
    
    # Ensure the request user is either the owner of the reservation, a superuser, or a special user
    is_owner = request.user.email == reservation.email
    is_special_user = request.user.email in ['SYSM@email.com', 'CSR@email.com']
    can_modify = request.user.is_superuser or is_special_user or is_owner

    # Proceed with status update only if the user has the right permissions
    if can_modify:
        new_status = request.data.get('status')
        
        # Check if the provided new status is valid based on the STATUS_CHOICES in the Reservation model
        if new_status in dict(Reservation.STATUS_CHOICES).keys():
            reservation.status = new_status  # Update the status
            reservation.save()  # Save the updated reservation object to the database
            return JsonResponse({'message': f'Reservation status updated to {new_status}.'}, status=200)
        else:
            # Respond with an error if the new status is not valid
            return JsonResponse({'error': 'Invalid status update. Please provide a valid status.'}, status=400)
    else:
        # Respond with an error if the user is not authorized to update the reservation status
        return JsonResponse({'error': 'You are not authorized to update this reservation status.'}, status=403)




