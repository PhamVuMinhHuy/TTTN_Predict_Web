from rest_framework.response import Response
from rest_framework import generics, status
from django.http import HttpResponse
from rest_framework.exceptions import ValidationError

from .serializers import RegisterSerializer
from .models import User  # Sửa từ Users thành User


# -------- REGISTER --------
class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        try:
            print(f"DEBUG: Register request data: {request.data}")
            serializer = self.serializer_class(data=request.data)

            if serializer.is_valid():
                print(f"DEBUG: Serializer valid data: {serializer.validated_data}")
                from .services.auth_services import AuthService
                user = AuthService.register_user(serializer.validated_data)

                return Response({
                    "message": "Register successful",
                    "user": {
                        "username": user.username,
                        "email": user.email
                    }
                }, status=status.HTTP_201_CREATED)

            print(f"DEBUG: Serializer errors: {serializer.errors}")
            return Response({
                "error": "Validation failed",
                "details": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            print(f"DEBUG: ValidationError: {e.detail}")
            return Response({
                "error": "Validation error",
                "details": e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"DEBUG: Unexpected error: {str(e)}")
            return Response({
                "error": "Internal server error",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# -------- LOGIN --------
class LoginView(generics.GenericAPIView):

    def post(self, request):
        try:
            username = request.data.get("username")
            password = request.data.get("password")

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

