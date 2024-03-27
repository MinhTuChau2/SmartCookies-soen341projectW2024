from django.test import TestCase
from django.urls import reverse
from accounts.serializers import User
from reservations.models import Reservation


#3 - Login Page

class LoginPageTestCase(TestCase):
    
    def test_login_page(self):
        # Access the login page
        response = self.client.get(reverse('login'))
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if the correct template is being used
        self.assertTemplateUsed(response, 'login.html')
    
    def test_login_with_wrong_credentials(self):
        # Access the login page
        response = self.client.post(reverse('login'), {'username': 'invaliduser', 'password': 'invalidpassword'})
        
        # Check if the response status code is 200 (as we are staying on the login page)
        self.assertEqual(response.status_code, 200)
        
        # Check if the error message is displayed
        self.assertContains(response, "Invalid username or password.")
        
    def test_successful_login(self):
        # Create a test user
        user = User.objects.create_user(username='testuser', password='testpassword')
        
        # Access the login page
        response = self.client.post(reverse('login'), {'username': 'testuser', 'password': 'testpassword'})
        
        # Check if the user is redirected to the home page upon successful login
        self.assertRedirects(response, reverse('home'))
        
        # Check if the user is logged in
        self.assertTrue(response.wsgi_request.user.is_authenticated)
    
    def test_register(self):
        # Access the registration page
        response = self.client.get(reverse('register'))
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if the correct template is being used
        self.assertTemplateUsed(response, 'register.html')
        
        # Check if the user is registered upon submitting the registration form
        response = self.client.post(reverse('register'), {'username': 'newuser', 'password1': 'newpassword', 'password2': 'newpassword'})
        self.assertEqual(response.status_code, 302)  # 302 - Redirect status code
        
        # Check if the user is created in the database
        self.assertTrue(User.objects.filter(username='newuser').exists())

        
 # 5 - backend data for each user       
        
class AccountTestCase(TestCase):
    
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        
        # Create some sample reservations for the test user
        Reservation.objects.create(user=self.user, car_id=1, reservation_date='2023-01-01')
        Reservation.objects.create(user=self.user, car_id=2, reservation_date='2023-02-01')
        
        # Create a superuser
        self.superuser = User.objects.create_superuser(username='admin', email='admin@example.com', password='adminpassword')
        
    def test_user_history(self):
        # Login as the test user
        self.client.login(username='testuser', password='password')
        
        # Access the history page
        response = self.client.get(reverse('history'))
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if the user's reservations are displayed
        reservations = Reservation.objects.filter(user=self.user)
        for reservation in reservations:
            self.assertContains(response, reservation.car_id)
            self.assertContains(response, reservation.reservation_date)
    
    def test_superuser_access(self):
        # Login as the superuser
        self.client.login(username='admin', password='adminpassword')
        
        # Access the user database page
        response = self.client.get(reverse('user-database'))
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if the user database is accessible
        self.assertContains(response, 'User Database')