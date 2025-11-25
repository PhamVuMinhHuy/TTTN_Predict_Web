from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import jwt
from django.conf import settings

from main.models import User


class AdminRequiredMixin:
    """Helper để kiểm tra token + role admin"""
    def get_admin_user(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None, Response({
                "error": "Authentication required",
                "details": "Authorization header missing or invalid"
            }, status=status.HTTP_401_UNAUTHORIZED)

        token = auth_header.split(' ')[1].strip('"').strip("'")
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            role = payload.get('role')

            if role != 'admin':
                return None, Response({
                    "error": "Forbidden",
                    "details": "Admin role required"
                }, status=status.HTTP_403_FORBIDDEN)

            user = User.objects(id=user_id).first()
            if not user:
                return None, Response({
                    "error": "User not found"
                }, status=status.HTTP_404_NOT_FOUND)

            return user, None
        except jwt.ExpiredSignatureError:
            return None, Response({
                "error": "Token expired"
            }, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError as e:
            return None, Response({
                "error": "Invalid token",
                "details": str(e)
            }, status=status.HTTP_401_UNAUTHORIZED)


class AdminUserListCreateView(AdminRequiredMixin, APIView):
    """
    GET: Lấy danh sách user
    POST: Tạo user mới
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Admin - Get list of users",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Bearer token (admin only)",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={200: "OK", 401: "Unauthorized", 403: "Forbidden"}
    )
    def get(self, request):
        admin_user, error_response = self.get_admin_user(request)
        if error_response:
            return error_response

        users = User.objects.all().order_by('-date_joined')
        data = []
        for u in users:
            data.append({
                "id": str(u.id),
                "username": u.username,
                "email": u.email,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "role": u.role,
                "date_joined": u.date_joined.isoformat() if u.date_joined else None,
            })
        return Response({"users": data}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Admin - Create a new user",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Bearer token (admin only)",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "username": openapi.Schema(type=openapi.TYPE_STRING),
                "password": openapi.Schema(type=openapi.TYPE_STRING),
                "email": openapi.Schema(type=openapi.TYPE_STRING),
                "first_name": openapi.Schema(type=openapi.TYPE_STRING),
                "last_name": openapi.Schema(type=openapi.TYPE_STRING),
                "role": openapi.Schema(type=openapi.TYPE_STRING, enum=['user', 'admin']),
            },
            required=["username", "password"]
        ),
        responses={201: "Created", 400: "Bad Request"}
    )
    def post(self, request):
        admin_user, error_response = self.get_admin_user(request)
        if error_response:
            return error_response

        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email", "")
        first_name = request.data.get("first_name", "")
        last_name = request.data.get("last_name", "")
        role = request.data.get("role", "user")

        if not username or not password:
            return Response({
                "error": "username and password are required"
            }, status=status.HTTP_400_BAD_REQUEST)

        if User.objects(username=username).first():
            return Response({
                "error": "Username already exists"
            }, status=status.HTTP_400_BAD_REQUEST)

        if email and User.objects(email=email).first():
            return Response({
                "error": "Email already exists"
            }, status=status.HTTP_400_BAD_REQUEST)

        user = User(
            username=username,
            email=email or None,
            first_name=first_name,
            last_name=last_name,
            role=role if role in ['user', 'admin'] else 'user',
        )
        user.set_password(password)
        user.save()

        return Response({
            "message": "User created successfully",
            "user": {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
            }
        }, status=status.HTTP_201_CREATED)


class AdminUserDeleteView(AdminRequiredMixin, APIView):
    """
    DELETE: Xóa user theo id
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Admin - Delete a user by ID",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Bearer token (admin only)",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={204: "No Content", 404: "Not Found"}
    )
    def delete(self, request, user_id):
        admin_user, error_response = self.get_admin_user(request)
        if error_response:
            return error_response

        # Không cho admin tự xóa chính mình
        if str(admin_user.id) == user_id:
            return Response({
                "error": "Cannot delete yourself"
            }, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects(id=user_id).first()
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)