from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import jwt
from django.conf import settings

from main.models import User


class UserProfileView(APIView):
    """
    API endpoint để lấy thông tin người dùng hiện tại
    Yêu cầu: Bearer token trong Authorization header
    """
    # Tắt DRF authentication để tự xử lý JWT
    authentication_classes = []
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Get current user profile",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Bearer token",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="User profile retrieved successfully",
                examples={
                    "application/json": {
                        "id": "user_id",
                        "username": "testuser",
                        "email": "test@example.com",
                        "name": "Test User",
                        "first_name": "Test",
                        "last_name": "User",
                        "role": "student",
                        "date_joined": "2024-01-01T00:00:00Z"
                    }
                }
            ),
            401: openapi.Response(
                description="Unauthorized - Invalid or missing token",
                examples={
                    "application/json": {
                        "error": "Authentication required",
                        "details": "Authorization header missing or invalid"
                    }
                }
            ),
            404: openapi.Response(
                description="User not found",
                examples={
                    "application/json": {
                        "error": "User not found"
                    }
                }
            )
        }
    )
    def get(self, request):
        try:
            print(f"DEBUG: ProfileView - GET request received")
            print(f"DEBUG: ProfileView - Request path: {request.path}")
            print(f"DEBUG: ProfileView - All headers: {dict(request.headers)}")
            
            # Lấy token từ header
            auth_header = request.headers.get('Authorization')
            print(f"DEBUG: ProfileView - Authorization header: {auth_header}")
            
            if not auth_header or not auth_header.startswith('Bearer '):
                print(f"DEBUG: ProfileView - Missing or invalid Authorization header")
                return Response({
                    "error": "Authentication required",
                    "details": "Authorization header missing or invalid"
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            token = auth_header.split(' ')[1]
            # Loại bỏ dấu ngoặc kép nếu có (trim và remove quotes)
            token = token.strip().strip('"').strip("'")
            print(f"DEBUG: ProfileView - Token extracted (after cleanup): {token[:50]}...")
            print(f"DEBUG: ProfileView - Using SECRET_KEY: {settings.SECRET_KEY[:20]}...")
            
            # Decode JWT token
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                print(f"DEBUG: ProfileView - Token decoded successfully: {payload}")
                user_id = payload.get('user_id')
                print(f"DEBUG: ProfileView - User ID from token: {user_id}")
            except jwt.ExpiredSignatureError as e:
                print(f"DEBUG: ProfileView - Token expired: {str(e)}")
                return Response({
                    "error": "Token expired"
                }, status=status.HTTP_401_UNAUTHORIZED)
            except jwt.InvalidTokenError as e:
                print(f"DEBUG: ProfileView - Invalid token: {str(e)}")
                import traceback
                traceback.print_exc()
                return Response({
                    "error": "Invalid token",
                    "details": str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Tìm user
            user = User.objects(id=user_id).first()
            if not user:
                return Response({
                    "error": "User not found"
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Trả về thông tin user
            return Response({
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "name": user.first_name or user.username,  # Tương thích với frontend
                "first_name": user.first_name,
                "last_name": user.last_name,
                "class_name": getattr(user, "class_name", None),
                "role": user.role,
                "date_joined": user.date_joined.isoformat() if user.date_joined else None
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"DEBUG: ProfileView error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                "error": "Internal server error",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

