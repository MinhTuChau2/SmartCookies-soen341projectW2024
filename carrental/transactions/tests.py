
from django.test import TestCase
from django.urls import reverse
from cars.models import Car
from cars.models import DamageReport

#8 - check-in customer

class CheckInTestCase(TestCase):
    
    def setUp(self):
        # Create a test car
        self.car = Car.objects.create(make='Toyota', model='Camry', year=2020, status='checked_out')
        
        # Create a test damage report for the car
        self.damage_report = DamageReport.objects.create(car=self.car, description='Scratch on the door')
        
    def test_display_car_status(self):
        # Access the check-in page
        response = self.client.get(reverse('check-in'))
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if the current status of the car is displayed
        self.assertContains(response, 'Current Status: checked_out')
    
    def test_display_damage_report(self):
        # Access the check-in page
        response = self.client.get(reverse('check-in'))
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if the damage report is displayed
        self.assertContains(response, 'Damage Report:')
        self.assertContains(response, self.damage_report.description)  

# 9 - checkout customer

class CheckoutTestCase(TestCase):
    
    def setUp(self):
        # Create a sample car
        self.car = Car.objects.create(make='Toyota', model='Camry', year=2020, status='reserved')
        
    def test_display_car_status(self):
        # Access the checkout page
        response = self.client.get(reverse('checkout'))
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if the current status of the car is displayed
        self.assertContains(response, self.car.status)
    
    def test_display_damages_on_checkin(self):
        # Create a sample damage for the car
        DamageReport.objects.create(car=self.car, description='Scratch on the rear bumper')
        
        # Access the checkout page
        response = self.client.get(reverse('checkout'))
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if the damages detected on the car during check-in are displayed
        self.assertContains(response, 'Scratch on the rear bumper')
    
    def test_return_process(self):
        # Access the return page and simulate the return process
        response = self.client.post(reverse('return'), {'car_id': self.car.id, 'new_damages': 'Scratch on the side'})
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if any new damages detected on the car during return are displayed
        self.assertContains(response, 'Scratch on the side')
        
        # Check if the car's status is updated to "returned"
        self.car.refresh_from_db()
        self.assertEqual(self.car.status, 'returned')
