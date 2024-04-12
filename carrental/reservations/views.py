from django.shortcuts import get_object_or_404
from accounts.models import CustomUser
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

from reservations.serializers import ReservationSerializer
from rental_agreements.views import send_rental_agreement
from django.contrib.auth.decorators import user_passes_test


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
                insurance=data.get('insurance', False),
                gps=data.get('gps', False),
                car_seat_count=int(data.get('carSeat', 0)),
                discountAmount=data.get('discountAmount', 0.00),
                points_used=data.get('pointsUsed', 0)

                
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
        if not can_modify:
            return Response({'error': 'Not authorized to update this reservation'}, status=403)
        if reservation.status in ['completed', 'cancelled', 'car_received', 'Finish']:
            return Response({'error': 'Cannot modify a completed or processed reservation.'}, status=403)

        old_discount = reservation.discountAmount
        serializer = ReservationSerializer(reservation, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Recalculate and update discount only if the dates were changed
            if 'pickup_date' in request.data or 'return_date' in request.data:
                new_discount = reservation.calculate_discount()
                if new_discount != old_discount:
                    reservation.discountAmount = new_discount
                    reservation.save()
            send_rental_agreement(request, reservation.id)  # Optionally resend rental agreement if needed
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        # Allow deletion only if reservation is not processed
        if reservation.status in ['completed', 'car_received', 'Finish']:
            return Response({'error': 'Cannot delete a processed reservation.'}, status=403)
        
        # Refund points if any were used
        if reservation.points_used > 0:
            user = CustomUser.objects.get(email=reservation.email)
            user.points += reservation.points_used  # Assumed mechanism to add points
            user.save()
        
        reservation.delete()
        return Response(status=204)

    return Response({'error': 'Invalid request'}, status=400)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_reservation_status(request, reservation_id):
    

    reservation = get_object_or_404(Reservation, id=reservation_id)
    new_status = request.data.get('status')
    

    if new_status not in dict(Reservation.STATUS_CHOICES).keys():
        return JsonResponse({'error': 'Invalid status update. Please provide a valid status.'}, status=400)

    reservation.status = new_status
    reservation.save()
   

    if new_status in ['completed', 'Finish']:
        try:
            user = CustomUser.objects.get(email=reservation.email)
            user.points += 10
            user.save()
            
        except CustomUser.DoesNotExist:
            
            return JsonResponse({'error': 'User associated with this reservation not found.'}, status=404)

    return JsonResponse({'message': f'Reservation status updated to {new_status}.'}, status=200)

@csrf_exempt
@user_passes_test(lambda u: u.is_superuser)
def update_reservation_status(request, reservation_id):
    reservation = get_object_or_404(Reservation, id=reservation_id)
    
    if request.method == 'PUT':
        new_status = request.POST.get('status')
        if new_status in dict(Reservation.STATUS_CHOICES):
            reservation.status = new_status
            reservation.save()
            return JsonResponse({'message': 'Reservation status updated successfully'}, status=200)
        else:
            return JsonResponse({'error': 'Invalid status'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def update_reservation_status_by_admin(request, reservation_id):
    reservation = get_object_or_404(Reservation, id=reservation_id)

    # Check if the user is a superuser or has a specific email
    if not (request.user.is_superuser or request.user.email == 'SYSM@email.com'):
        return Response({'error': 'You do not have permission to update the status.'}, status=403)

    new_status = request.data.get('status')
    if new_status not in dict(Reservation.STATUS_CHOICES).keys():
        return Response({'error': 'Invalid status update. Please provide a valid status.'}, status=400)

    reservation.status = new_status
    reservation.save()

    return Response({'message': f'Reservation status updated to {new_status}.'})

