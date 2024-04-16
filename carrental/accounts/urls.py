# accounts/urls.py
from django.urls import path
from .views import UserRegistrationView, CustomObtainAuthToken  # Ensure these are correctly imported
from .views import UserDetailView
from .views import get_user_data
from .views import update_user_points
urlpatterns = [
    path('signup/', UserRegistrationView.as_view(), name='signup'),
    path('login/', CustomObtainAuthToken.as_view(), name='login'),
    path('user/', UserDetailView.as_view(), name='user_detail'),
    path('api/get-user-data/', get_user_data, name='get_user_data'),
    path('api/update-points/', update_user_points, name='update_user_points')

]
