# Generated by Django 4.2.11 on 2024-03-25 19:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("reservations", "0002_rename_car_type_reservation_car_model_and_more"),
    ]

    operations = [
        migrations.AddField(
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
                ],
                default="pending",
                max_length=20,
            ),
        ),
    ]
