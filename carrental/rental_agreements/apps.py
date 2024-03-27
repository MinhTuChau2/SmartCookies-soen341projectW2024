from django.apps import AppConfig


class RentalAgreementsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "rental_agreements"


    def ready(self):
        import rental_agreements.signals  # noqa


