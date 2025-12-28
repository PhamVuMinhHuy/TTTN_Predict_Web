from rest_framework.response import Response
from rest_framework import generics, status
from django.http import HttpResponse
from rest_framework.exceptions import ValidationError

from .models import User


# -------- LOGIN --------
class LoginView(generics.GenericAPIView):

    def post(self, request):
        try:
            username = request.data.get("Username")
            password = request.data.get("Password")

            if username is None or password is None:
                return Response({
                    "error": "Missing credentials",
                    "details": "Username and Password are required"
                }, status=status.HTTP_400_BAD_REQUEST)

            from .services.auth_services import AuthService
            tokens = AuthService.login_user(username, password)
            return Response({
                "message": "Login successful",
                **tokens
            }, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({
                "error": "Authentication failed",
                "details": e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "error": "Internal server error", 
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def home(request):
    return HttpResponse("Welcome to Predict Learning Web!")

