# Generated by Django 4.2.11 on 2024-03-29 05:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("reservations", "0006_alter_reservation_status"),
    ]

    operations = [
        migrations.AlterField(
            model_name="reservation",
            name="status",
            field=models.CharField(
                choices=[
                    ("pending", "Pending"),
                    ("agreement_sent", "Agreement Sent"),
                    ("agreement_signed", "Agreement Signed"),
                    ("under_review", "Under Review"),
                    ("accepted", "Accepted"),
                    ("payment_pending", "Payment Pending"),
                    ("completed", "Completed"),
                    ("cancelled", "Cancelled"),
                    ("car_received", "Car received"),
                    ("Finish", "Finish"),
                ],
                default="pending",
                max_length=20,
            ),
        ),
    ]
