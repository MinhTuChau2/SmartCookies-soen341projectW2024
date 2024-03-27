# Generated by Django 4.2.11 on 2024-03-27 03:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("cars", "0003_car_image"),
    ]

    operations = [
        migrations.CreateModel(
            name="DamageReport",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("description", models.TextField(verbose_name="description")),
                (
                    "reported_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="reported at"),
                ),
                (
                    "car",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="cars.car"
                    ),
                ),
            ],
            options={
                "verbose_name": "damage report",
                "verbose_name_plural": "damage reports",
            },
        ),
    ]