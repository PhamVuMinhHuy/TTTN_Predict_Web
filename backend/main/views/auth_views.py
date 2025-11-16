from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from main.serializers import RegisterSerializer
from main.services.auth_services import AuthService


class RegisterView(APIView):
    @swagger_auto_schema(
        operation_description="Register a new user",
        request_body=RegisterSerializer,
        responses={
            201: openapi.Response(
                description="User created successfully",
                examples={
                    "application/json": {
                        "message": "Register successful",
                        "user": {
                            "username": "testuser",
                            "email": "test@example.com"
                        }
                    }
                }
            ),
            400: openapi.Response(
                description="Validation error",
                examples={
                    "application/json": {
                        "error": "Validation failed",
                        "details": {
                            "username": ["Username already exists."]
                        }
                    }
                }
            )
        }
    )
    def post(self, request):
        try:
            print(f"DEBUG: Register request data: {request.data}")
            serializer = RegisterSerializer(data=request.data)

            if serializer.is_valid():
                print(f"DEBUG: Serializer valid data: {serializer.validated_data}")
                user = AuthService.register_user(serializer.validated_data)
                return Response({
                    "message": "Register successful",
                    "user": {
                        "username": user.username,
                        "email": user.email
                    }
                }, status=status.HTTP_201_CREATED)

            print(f"DEBUG: Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            print(f"DEBUG: ValidationError: {e.detail}")
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"DEBUG: Unexpected error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    @swagger_auto_schema(
        operation_description="Login user",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='username'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='password'),
            },
            required=['username', 'password']
        ),
        responses={
            200: openapi.Response(
                description="Login successful",
                examples={
                    "application/json": {
                        "message": "Login successful",
                        "access": "jwt_token_here",
                        "refresh": "refresh_token_here",
                        "user": {
                            "id": "user_id",
                            "username": "testuser",
                            "email": "test@example.com"
                        }
                    }
                }
            ),
            400: openapi.Response(
                description="Authentication failed",
                examples={
                    "application/json": {
                        "error": "Authentication failed",
                        "details": {"detail": "Invalid username or password"}
                    }
                }
            )
        }
    )
    def post(self, request):
        try:
            username = request.data.get("username")
            password = request.data.get("password")

            if not username or not password:
                return Response(
                    {"detail": "Username and Password are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            tokens = AuthService.login_user(username, password)
            return Response({
                "message": "Login successful",
                **tokens
            }, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
