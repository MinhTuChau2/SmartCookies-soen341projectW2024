import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from uuid import uuid4
from django.http import HttpResponse
from django.utils import timezone
from .models import Reservation, Car, Branch
from django.core.mail import EmailMessage


def generate_rental_agreement(request, reservation_id,as_attachment=False):
    # Fetch the reservation instance
    reservation = Reservation.objects.get(id=reservation_id)
    car = Car.objects.get(model=reservation.car_model)  # Fetch the car based on the car_model field in Reservation
    branches = Branch.objects.filter(cars=car)  # Fetch branches associated with the car
    

    # Create a buffer for the PDF
    buffer = io.BytesIO()

    # Create a canvas
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter  # Get dimensions

    # Unique Rental Agreement Number
    agreement_number = uuid4()

    # Assuming you want to list all branches or use a specific one for pick-up location
    car_location = ', '.join(branch.location for branch in branches)

    # Renter Info
    renter_name = reservation.name  # Directly using the 'name' field from the Reservation model
    renter_email = reservation.email  # Directly using the 'email' field from the Reservation model

    # Vehicle Info
    vehicle_make = car.maker  # Using 'maker' from the Car model
    vehicle_model = car.model  # Using 'model' from the Car model
    vehicle_year = car.year  # Using 'year' from the Car model
    vehicle_license_plate = "Unknown"  # Placeholder, as it's not provided in the Car model
    vehicle_vin = "Unknown"  # Placeholder, as it's not provided in the Car model
    vehicle_color = "Unknown"  # Placeholder, as it's not provided in the Car model

    # Rental Details
    rental_start_date = reservation.pickup_date.strftime('%Y-%m-%d')
    rental_end_date = reservation.return_date.strftime('%Y-%m-%d')
    rental_period = (reservation.return_date - reservation.pickup_date).days
    rental_rate = "Unknown"  # Placeholder, as it's not provided in the Reservation model
    additional_services = "None"  # Placeholder, replace with actual data if available

    # Define company details
    rental_company_name = "Cookie Cruisers"
    rental_company_address = branches

    # Drawing the PDF content
    y_position = height - 40  # Starting Y position

    # Title
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, y_position, "Car Rental Agreement")
    y_position -= 20

    # Agreement Number
    p.setFont("Helvetica", 12)
    p.drawString(100, y_position, f"Rental Agreement Number: {agreement_number}")
    y_position -= 20

    # Introductory Paragraph
    p.drawString(100, y_position, f"This Rental Agreement is entered into between {rental_company_name},")
    y_position -= 15
    p.drawString(100, y_position, f"located at {rental_company_address}, hereinafter referred to as the 'Rental Company',")
    y_position -= 15
    p.drawString(100, y_position, "and the individual or entity identified below, hereinafter referred to as the 'Renter':")
    y_position -= 30

    # Renter Information
    p.drawString(100, y_position, f"1. Renter's Information:")
    y_position -= 15
    p.drawString(120, y_position, f"Name: {renter_name}")
    y_position -= 15
    p.drawString(120, y_position, f"Address: [Renter's Address]")  # Placeholder
    y_position -= 15
    p.drawString(120, y_position, f"Contact Number: [Renter's Contact Number]")  # Placeholder
    y_position -= 15
    p.drawString(120, y_position, f"Email Address: {renter_email}")
    y_position -= 15
    p.drawString(120, y_position, f"Driver's License Number: [Renter's License Number]")  # Placeholder
    y_position -= 30

    # Vehicle Information
    p.drawString(100, y_position, "2. Vehicle Information:")
    y_position -= 15
    p.drawString(120, y_position, f"Make: {vehicle_make}")
    y_position -= 15
    p.drawString(120, y_position, f"Model: {vehicle_model}")
    y_position -= 15
    p.drawString(120, y_position, f"Year: {vehicle_year}")
    y_position -= 15
    p.drawString(120, y_position, f"License Plate Number: {vehicle_license_plate}")
    y_position -= 15
    p.drawString(120, y_position, f"Vehicle Identification Number (VIN): {vehicle_vin}")
    y_position -= 15
    p.drawString(120, y_position, f"Color: {vehicle_color}")
    y_position -= 30

    # Rental Details
    p.drawString(100, y_position, "3. Rental Details:")
    y_position -= 15
    p.drawString(120, y_position, f"Rental Start Date: {rental_start_date}")
    y_position -= 15
    p.drawString(120, y_position, f"Rental End Date: {rental_end_date}")
    y_position -= 15
    p.drawString(120, y_position, f"Pick-up Location: {car_location}")  # Using car_location as Pick-up Location
    y_position -= 15
    p.drawString(120, y_position, f"Drop-off Location: [Specify Drop-off Location]")  # Placeholder
    y_position -= 15
    p.drawString(120, y_position, f"Rental Period: {rental_period} days")
    y_position -= 15
    p.drawString(120, y_position, f"Mileage Limit: [Specify if applicable]")  # Placeholder
    y_position -= 15
    p.drawString(120, y_position, f"Rental Rate: {rental_rate}")
    y_position -= 15
    p.drawString(120, y_position, f"Additional Services: {additional_services}")
    y_position -= 30

    # Add Rental Terms and Conditions, Indemnification, Governing Law, and Signatures similar to the sections above
    # Rental Terms and Conditions
    p.drawString(100, y_position, "4. Rental Terms and Conditions:")
    y_position -= 15
    terms = [
        "The Renter acknowledges receiving the vehicle described above in good condition and agrees to return it in the same condition, subject to normal wear and tear.",
        "The Renter agrees to use the vehicle solely for personal or business purposes and not for any illegal activities.",
        "The Renter agrees to pay the Rental Company the agreed-upon rental rate for the specified rental period. Additional charges may apply for exceeding the mileage limit, late returns, fuel refueling, or other damages.",
        "The Renter agrees to bear all costs associated with traffic violations, tolls, and parking fines incurred during the rental period.",
        "The Renter acknowledges that they are responsible for any loss or damage to the vehicle, including theft, vandalism, accidents, or negligence, and agrees to reimburse the Rental Company for all repair or replacement costs.",
        "The Renter agrees to return the vehicle to the designated drop-off location at the agreed-upon date and time. Failure to do so may result in additional charges.",
        "The Rental Company reserves the right to terminate this agreement and repossess the vehicle without prior notice if the Renter breaches any terms or conditions of this agreement.",
        "The Renter acknowledges receiving and reviewing a copy of the vehicle's insurance coverage and agrees to comply with all insurance requirements during the rental period."
    ]
    for term in terms:
        p.drawString(120, y_position, term)
        y_position -= 15
        if y_position < 100:  # Check for page end
            p.showPage()
            y_position = height - 40

# Indemnification
    p.drawString(100, y_position, "5. Indemnification:")
    y_position -= 15
    indemnity_clause = "The Renter agrees to indemnify and hold harmless the Rental Company, its employees, agents, and affiliates from any claims, liabilities, damages, or expenses arising out of or related to the Renter's use of the vehicle."
    p.drawString(120, y_position, indemnity_clause)
    y_position -= 30

# Governing Law
    p.drawString(100, y_position, "6. Governing Law:")
    y_position -= 15
    governing_law_clause = "This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction]. Any disputes arising under or related to this Agreement shall be resolved exclusively by the courts of [Jurisdiction]."
    p.drawString(120, y_position, governing_law_clause)
    y_position -= 30

# Signatures
    p.drawString(100, y_position, "7. Signatures:")
    y_position -= 15
    p.drawString(120, y_position, "Rental Company:")
    y_position -= 15
    p.drawString(140, y_position, "Signature:      SmartCookies.ADMIN      Date: ____________________")
    y_position -= 30
    p.drawString(120, y_position, "Renter:")
    y_position -= 15
    p.drawString(140, y_position, "Signature: ___________________________  Date: ____________________")
    y_position -= 30

# Ensure there is a call to p.showPage() if needed and p.save() to finalize the PDF document

    p.showPage()
    p.save()

    # Move to the beginning of the StringIO buffer
    buffer.seek(0)

    if as_attachment:
        # Return the buffer for email attachment
        return buffer
    else:
        # Return HttpResponse for direct download
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="rental_agreement_{agreement_number}.pdf"'
        return response


def send_rental_agreement(reservation_id):
    reservation = Reservation.objects.get(id=reservation_id)
    buffer = generate_rental_agreement(reservation_id)  # Ensure this returns the file buffer

    # Prepare and send the email
    subject = "Your Car Rental Agreement"
    body = "Please find attached your car rental agreement. Fill it out and return it to us."
    email = EmailMessage(subject, body, 'from@example.com', [reservation.user.email])
    buffer.seek(0)  # Move to the beginning of the buffer
    email.attach('rental_agreement.pdf', buffer.getvalue(), 'application/pdf')
    email.send()
