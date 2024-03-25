from django.shortcuts import render

from rest_framework.views import APIView
from .models import Car
from .serializer import CarSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from rest_framework import status
from django.http import Http404




class CarView(APIView):
    permission_classes = [IsAuthenticated]
   
    def get(self, request):
        cars = Car.objects.all()  # Retrieve all instances of the Car model
        serializer = CarSerializer(cars, many=True)  # Serialize the queryset
        # Construct complete image URLs
        base_url = request.build_absolute_uri('/')  # Get the base URL of the Django server
        for car_data in serializer.data:
            if 'image' in car_data:
                car_data['image'] = f"{base_url.strip('/')}{car_data['image']}"
        return Response(serializer.data)  # Return serialized data as response

    def post(self, request):
        serializer = CarSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Return serialized data and 201 status code for successful creation
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return errors and 400 status code for invalid data

    def delete(self, request, model):
        try:
            car = Car.objects.get(model=model)
        except Car.DoesNotExist:
            raise Http404

        car.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
