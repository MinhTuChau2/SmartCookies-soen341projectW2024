
from django.urls import path
from .views import ( signup, user_logout,user_login)
from django.urls import path
from .views import signup, user_logout, user_login

urlpatterns = [
    # URL pattern for user registration
    path('signup/', signup, name='signup'),

    # URL pattern for user login
    path('login/', user_login, name='login'),

    # URL pattern for user logout
    path('logout/', user_logout, name='logout'),

    # Add more URL patterns for other account-related functionalities as needed
]

