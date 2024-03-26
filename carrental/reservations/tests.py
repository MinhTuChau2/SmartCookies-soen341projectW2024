from django.test import TestCase
from django.urls import reverse
from cars.models import DamageReport
from cars.models import Car
#from myapp.models import Car, Reservation  # Replace 'Car' and 'Reservation' with your actual models

#4 - reservation

class ReservationTestCase(TestCase):
    
    def setUp(self):
        # Create a test car
        self.car = Car.objects.create(make='Toyota', model='Camry', year=2020)
        
    def test_reservation_flow(self):
        # Access the car listing page
        response = self.client.get(reverse('car-listing'))
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if the "Reserve" button is present and clickable
        self.assertContains(response, '<button', count=1)  # Assuming there is one "Reserve" button
        
        # Click the "Reserve" button
        response = self.client.post(reverse('reserve'), {'car_id': self.car.id})
        
        # Check if the response is successful and user is redirected to reservation page
        self.assertEqual(response.status_code, 302)  # 302 - Redirect status code
        self.assertTrue(response.url.startswith(reverse('reservation')))
        
        # Check if the car ID and model are pre-filled in the reservation form
        self.assertContains(response, f'value="{self.car.id}"')
        self.assertContains(response, f'value="{self.car.model}"')
        
        # Fill up the reservation form and reserve the car
        # Replace the following line with form submission logic based on your application
        
        # Simulating form submission
        reservation_data = {
            'car_id': self.car.id,
            # Fill up other reservation form fields here
        }
        response = self.client.post(reverse('reservation'), reservation_data)
        
        # Check if the user is redirected to the home page after reservation
        self.assertRedirects(response, reverse('home'))
        
        # Check if the car status is updated after reservation
        self.car.refresh_from_db()
        self.assertEqual(self.car.status, 'reserved')
             