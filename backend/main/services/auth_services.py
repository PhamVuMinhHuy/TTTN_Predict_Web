from django.contrib.auth.hashers import make_password, check_password
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from main.models import User


class AuthService:

    # --------- REGISTER ----------
    @staticmethod
    def register_user(validated_data):
        username = validated_data["username"]
        email = validated_data["email"]
        password = validated_data["password"]

        if User.objects(username=username).first():
            raise ValueError("Username already exists")

        user = User.objects.create(
            username=username,
            email=email,
            password_hash=make_password(password)
        )
        return user

    # --------- LOGIN ----------
    @staticmethod
    def login_user(username, password):
        try:
            user = User.objects.get(Username=username)
        except User.DoesNotExist:
            raise ValidationError({"detail": "Invalid username or password"})

        if not check_password(password, user.PasswordHash):
            raise ValidationError({"detail": "Invalid username or password"})

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }
