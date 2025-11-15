from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from main.serializers import RegisterSerializer
from main.services.auth_services import AuthService


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = AuthService.register_user(serializer.validated_data)
            return Response({
                "message": "Register successful",
                "user": {
                    "Username": user.Username,
                    "Email": user.Email
                }
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("Username")
        password = request.data.get("Password")

        if not username or not password:
            return Response(
                {"detail": "Username and Password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        tokens = AuthService.login_user(username, password)
        return Response({
            "message": "Login successful",
            "tokens": tokens
        }, status=status.HTTP_200_OK)
