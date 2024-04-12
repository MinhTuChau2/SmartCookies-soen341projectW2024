# accounts/urls.py
from django.urls import path
from .views import UserRegistrationView, CustomObtainAuthToken  # Ensure these are correctly imported
from .views import UserDetailView
from .views import get_user_data
<<<<<<< HEAD
from .views import update_user_points
=======
from .views import UserListView


>>>>>>> 36b4099d8a9b2279a0c383421324ca285da56f8b
urlpatterns = [
    path('signup/', UserRegistrationView.as_view(), name='signup'),
    path('login/', CustomObtainAuthToken.as_view(), name='login'),
    path('user/', UserDetailView.as_view(), name='user_detail'),
<<<<<<< HEAD
    path('api/get-user-data/', get_user_data, name='get_user_data'),
    path('api/update-points/', update_user_points, name='update_user_points')

=======
    path('api/users/', UserListView.as_view(), name='user-list'),
    path('api/get-user-data/', get_user_data, name='get_user_data'),
    path('api/users/<str:email>/', UserListView.as_view(), name='user-detail')
   
>>>>>>> 36b4099d8a9b2279a0c383421324ca285da56f8b
]

