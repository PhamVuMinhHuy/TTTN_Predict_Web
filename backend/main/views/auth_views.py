from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import random
from datetime import datetime, timedelta

from main.serializers import RegisterSerializer
from main.services.auth_services import AuthService
from main.models import User, PasswordResetOTP
from main.services.email_service import EmailService


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
                            "Username": ["Username already exists."]
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
                'Username': openapi.Schema(type=openapi.TYPE_STRING, description='Username'),
                'Password': openapi.Schema(type=openapi.TYPE_STRING, description='Password'),
            },
            required=['Username', 'Password']
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
                **tokens
            }, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ForgotPasswordRequestView(APIView):
    """API để yêu cầu reset password - gửi OTP qua email"""
    
    @swagger_auto_schema(
        operation_description="Request password reset - Send OTP to email",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
            },
            required=['email']
        ),
        responses={
            200: "OTP sent successfully",
            400: "Invalid email",
            404: "Email not found"
        }
    )
    def post(self, request):
        try:
            email = request.data.get('email', '').strip().lower()
            
            if not email:
                return Response(
                    {"error": "Email is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if user exists
            user = User.objects(email=email).first()
            if not user:
                return Response(
                    {"error": "Email không tồn tại trong hệ thống"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Generate 6-digit OTP
            otp_code = str(random.randint(100000, 999999))
            
            # Set expiry time (10 minutes from now)
            expires_at = datetime.utcnow() + timedelta(minutes=10)
            
            # Delete old OTPs for this email
            PasswordResetOTP.objects(email=email).delete()
            
            # Create new OTP
            otp = PasswordResetOTP(
                email=email,
                otp_code=otp_code,
                expires_at=expires_at
            )
            otp.save()
            
            # Send OTP via email
            email_sent = EmailService.send_otp_email(email, otp_code)
            
            if not email_sent:
                return Response(
                    {"error": "Không thể gửi email. Vui lòng thử lại sau."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            return Response({
                "message": "Mã OTP đã được gửi đến email của bạn",
                "expires_in_minutes": 10
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"DEBUG: ForgotPasswordRequest error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerifyOTPView(APIView):
    """API để xác thực OTP"""
    
    @swagger_auto_schema(
        operation_description="Verify OTP code",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
                'otp': openapi.Schema(type=openapi.TYPE_STRING, description='6-digit OTP code'),
            },
            required=['email', 'otp']
        ),
        responses={
            200: "OTP verified successfully",
            400: "Invalid or expired OTP",
            404: "OTP not found"
        }
    )
    def post(self, request):
        try:
            email = request.data.get('email', '').strip().lower()
            otp_code = request.data.get('otp', '').strip()
            
            if not email or not otp_code:
                return Response(
                    {"error": "Email and OTP are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Find OTP
            otp = PasswordResetOTP.objects(
                email=email,
                otp_code=otp_code,
                is_verified=False
            ).first()
            
            if not otp:
                return Response(
                    {"error": "Mã OTP không hợp lệ"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if expired
            if datetime.utcnow() > otp.expires_at:
                return Response(
                    {"error": "Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Mark as verified
            otp.is_verified = True
            otp.save()
            
            return Response({
                "message": "Xác thực OTP thành công",
                "verified": True
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"DEBUG: VerifyOTP error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ResetPasswordView(APIView):
    """API để đặt lại mật khẩu sau khi xác thực OTP"""
    
    @swagger_auto_schema(
        operation_description="Reset password after OTP verification",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
                'otp': openapi.Schema(type=openapi.TYPE_STRING, description='Verified OTP code'),
                'new_password': openapi.Schema(type=openapi.TYPE_STRING, description='New password'),
            },
            required=['email', 'otp', 'new_password']
        ),
        responses={
            200: "Password reset successfully",
            400: "Invalid request or OTP not verified",
            404: "User not found"
        }
    )
    def post(self, request):
        try:
            email = request.data.get('email', '').strip().lower()
            otp_code = request.data.get('otp', '').strip()
            new_password = request.data.get('new_password', '')
            
            if not email or not otp_code or not new_password:
                return Response(
                    {"error": "Email, OTP và mật khẩu mới là bắt buộc"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate password strength
            if len(new_password) < 8:
                return Response(
                    {"error": "Mật khẩu phải có ít nhất 8 ký tự"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Find verified OTP
            otp = PasswordResetOTP.objects(
                email=email,
                otp_code=otp_code,
                is_verified=True
            ).first()
            
            if not otp:
                return Response(
                    {"error": "OTP chưa được xác thực hoặc không hợp lệ"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if expired
            if datetime.utcnow() > otp.expires_at:
                return Response(
                    {"error": "OTP đã hết hạn"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Find user
            user = User.objects(email=email).first()
            if not user:
                return Response(
                    {"error": "Người dùng không tồn tại"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Update password
            user.set_password(new_password)
            user.save()
            
            # Delete all OTPs for this email
            PasswordResetOTP.objects(email=email).delete()
            
            # Send success email
            EmailService.send_password_reset_success_email(email)
            
            return Response({
                "message": "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới."
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"DEBUG: ResetPassword error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
