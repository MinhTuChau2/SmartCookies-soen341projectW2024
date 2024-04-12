from django.test import TestCase
from django.urls import reverse
from accounts.serializers import User
from cars.models import Car
from reservations.models import Reservation


# 1 - Car listing page from a customer’s point of view
class CarListingPageTestCase(TestCase):
    def setUp(self):
        # Create some sample cars
        Car.objects.create(maker='Toyota', model='Camry', year=2020, price =250.00)
        Car.objects.create(maker='Honda', model='Accord', year=2019, price = 250.00)

    def test_view_car_listing_page(self):
        # Access the car listing page
        response = self.client.get(reverse('car-listing'))

        # Check if the response is successful
        self.assertEqual(response.status_code, 200)

        # Check if all cars are displayed on the page
        self.assertQuerysetEqual(response.context['cars'], Car.objects.all())

    def test_filter_cars(self):
        # Filter cars by make, model, and year
        filter_criteria = {'maker': 'Toyota', 'model': 'Camry', 'year': 2020}
        response = self.client.post(reverse('car-listing'), filter_criteria)

        # Check if the response is successful
        self.assertEqual(response.status_code, 200)

        # Check if the filtered cars are displayed on the page
        filtered_cars = response.context['cars']
        self.assertEqual(filtered_cars.count(), 1)
        self.assertEqual(filtered_cars[0].make, 'Toyota')
        self.assertEqual(filtered_cars[0].model, 'Camry')
        self.assertEqual(filtered_cars[0].year, 2020)

# 2 - Home Page
        

class HomePageTestCase(TestCase):
    
    def test_view_home_page(self):
        # Access the home page
        response = self.client.get(reverse('home'))
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if the correct template is being used
        self.assertTemplateUsed(response, 'home.html')
        
        # Check if the CSS design of the frontend team is properly applied
        self.assertContains(response, '<link rel="stylesheet" href="/path/to/frontend/style.css">', html=True)
        # Replace "/path/to/frontend/style.css" with the actual path to your CSS file
    
    def test_buttons_on_home_page(self):
        # Access the home page
        response = self.client.get(reverse('home'))
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if buttons are present on the home page and are clickable
        self.assertContains(response, '<button', count=2)  # Assuming there are two buttons

        # Add additional assertions here to ensure the buttons redirect to the correct pages


#6 - status of car

class CarStatusTestCase(TestCase):
    
    def setUp(self):
        # Create a test superuser
        self.superuser = User.objects.create_superuser(username='admin', email='admin@example.com', password='adminpassword')
        
        # Create a test car
        self.car = Car.objects.create(maker='Toyota', model='Camry', year=2020, status='available')
        
        # Create a test reservation
        self.reservation = Reservation.objects.create(user=self.superuser, car=self.car, reservation_date='2023-01-01')
        
    def test_superuser_access_cars_database(self):
        # Login as the superuser
        self.client.login(username='admin', password='adminpassword')
        
        # Access the cars database page
        response = self.client.get(reverse('cars-database'))
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if the cars database is accessible
        self.assertContains(response, 'Cars Database')
        
    def test_car_unavailability(self):
        # Update car status to 'unavailable'
        self.car.status = 'unavailable'
        self.car.save()
        
        # Access the car listing page
        response = self.client.get(reverse('car-listing'))
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if the unavailable car is not visible on the car listing page
        self.assertNotContains(response, self.car.model)  

