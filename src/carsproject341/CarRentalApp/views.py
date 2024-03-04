from django.shortcuts import render

# Create your views here.

#defining a new API endpoint to that return a JSON respons with the msg "Hello, world!"
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

#function
#@api_view(['GET'])
#def hello_world(request):
#    return Response({'message': 'Hello, world!'})

