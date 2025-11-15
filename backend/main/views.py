from rest_framework.response import Response
from rest_framework import generics, status
from django.contrib.auth.hashers import check_password

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer
from .models import Users


# -------- REGISTER --------
class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response({
                "message": "Register successful",
                "user": {
                    "Username": user.Username,
                    "Email": user.Email
                }
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------- LOGIN (JWT) --------
class LoginView(generics.GenericAPIView):

    def post(self, request):
        username = request.data.get("Username")
        password = request.data.get("Password")

        if username is None or password is None:
            return Response({"error": "Missing Username or Password"}, status=400)

        try:
            user = Users.objects.get(Username=username)
        except Users.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=400)

        if not check_password(password, user.PasswordHash):
            return Response({"error": "Invalid credentials"}, status=400)

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })
