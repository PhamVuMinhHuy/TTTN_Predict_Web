from django.contrib.auth.hashers import make_password, check_password
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from main.models import Users


class AuthService:

    # --------- REGISTER ----------
    @staticmethod
    def register_user(validated_data):
        username = validated_data["Username"]
        email = validated_data.get("Email")
        password = validated_data["Password"]

        if Users.objects.filter(Username=username).exists():
            raise ValidationError({"Username": "Username already exists."})

        user = Users.objects.create(
            Username=username,
            Email=email,
            PasswordHash=make_password(password)
        )
        return user

    # --------- LOGIN ----------
    @staticmethod
    def login_user(username, password):
        try:
            user = Users.objects.get(Username=username)
        except Users.DoesNotExist:
            raise ValidationError({"detail": "Invalid username or password"})

        if not check_password(password, user.PasswordHash):
            raise ValidationError({"detail": "Invalid username or password"})

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }
