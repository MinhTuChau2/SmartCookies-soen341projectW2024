# Create your tests here.
from django.test import TestCase
from django.urls import reverse

from branch.models import Branch
from cars.models import Car



# 7 - find a branch

class BranchTestCase(TestCase):
    
    def setUp(self):
        # Create some sample branches
        self.branch1 = Branch.objects.create(name='Branch 1', location='Location 1')
        self.branch2 = Branch.objects.create(name='Branch 2', location='Location 2')
        
        # Create some sample cars at branches
        self.car1 = Car.objects.create(make='Toyota', model='Camry', year=2020, branch=self.branch1)
        self.car2 = Car.objects.create(make='Honda', model='Accord', year=2021, branch=self.branch2)
        
    def test_user_input_credentials(self):
        # Access the branch page
        response = self.client.get(reverse('find-branch'))
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if the credentials input fields are present in the page
        self.assertContains(response, '<input type="text" name="username"', html=True)
        self.assertContains(response, '<input type="password" name="password"', html=True)
    
    def test_user_input_location(self):
        # Access the branch page
        response = self.client.get(reverse('find-branch'))
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if the location input field is present in the page
        self.assertContains(response, '<input type="text" name="location"', html=True)
    
    def test_nearest_car_display(self):
        # Access the branch page and input location
        response = self.client.post(reverse('find-branch'), {'location': 'Location 1'})
        
        # Check if the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check if the nearest car is displayed to the user for selection
        self.assertContains(response, self.car1.model)
        self.assertNotContains(response, self.car2.model)