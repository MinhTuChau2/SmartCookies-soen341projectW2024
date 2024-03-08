# accounts/backends.py
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist

UserModel = get_user_model()

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = UserModel.objects.get(email=username)
            if user.check_password(password):
                return user
        except (ObjectDoesNotExist, MultipleObjectsReturned):
            # Run the default password hasher once to reduce timing
            # difference between an existing and a non-existing user (#20760).
            UserModel().set_password(password)
