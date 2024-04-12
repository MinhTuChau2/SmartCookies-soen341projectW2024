
from django.test import TestCase
from django.urls import reverse
from carrental.transactions.models import BankAccount, Transaction
from cars.models import Car
from cars.models import DamageReport
from django.contrib.auth import get_user_model

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

#10 - Cookie Points

class IssueTrackingAcceptanceTestCase(TestCase):
    def setUp(self):
        # Create a user
        self.User = get_user_model()
        self.user = self.User.objects.create_user(username='test_user', email='test@example.com', password='password123')

        # Create a bank account for the user
        self.bank_account = BankAccount.objects.create(user=self.user, balance=1500)

    def test_issue_tracking_payment_passes(self):
        # Simulate a successful payment
        payment_amount = 200
        initial_balance = self.bank_account.balance
        Transaction.objects.create(user=self.user, amount=payment_amount, transaction_type='payment')

        # Retrieve the user's bank account after the transaction
        updated_bank_account = BankAccount.objects.get(user=self.user)

        # Assert that the user's bank account balance is updated correctly after the payment
        self.assertEqual(updated_bank_account.balance, initial_balance - payment_amount)

    def test_issue_tracking_cookie_points_deposited(self):
        # Simulate a certain amount of cookie points deposited into the user's account
        initial_balance = self.bank_account.balance
        cookie_points_deposited = 100
        Transaction.objects.create(user=self.user, amount=cookie_points_deposited, transaction_type='reimbursement')

        # Retrieve the user's bank account after the transaction
        updated_bank_account = BankAccount.objects.get(user=self.user)

        # Assert that the user's bank account balance is updated correctly after the cookie points deposit
        self.assertEqual(updated_bank_account.balance, initial_balance + cookie_points_deposited)

    def tearDown(self):
        # Clean up the test data
        self.bank_account.delete()
        self.user.delete()