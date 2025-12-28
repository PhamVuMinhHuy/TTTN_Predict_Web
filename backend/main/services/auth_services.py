from django.contrib.auth.hashers import make_password, check_password
from rest_framework.exceptions import ValidationError
from main.models import User
import time
import jwt
from django.conf import settings


class AuthService:
    # register_user method đã bị xóa vì chức năng đăng ký không cần thiết
    # Tài khoản người dùng sẽ do Admin tạo thông qua Admin Dashboard (AdminUserListCreateView)

    @staticmethod
    def login_user(username, password):
        try:
            print(f"DEBUG: Attempting to login with identifier: {username}")
            
            # Tìm user bằng username trước
            user = User.objects(username=username).first()
            if not user:
                # Nếu không tìm thấy, thử tìm bằng email
                print(f"DEBUG: User not found by username, trying email: {username}")
                user = User.objects(email=username).first()
                if not user:
                    print(f"DEBUG: User not found with username or email: {username}")
                    raise ValidationError({"detail": "Email không đúng hoặc không tồn tại"})
                else:
                    print(f"DEBUG: User found by email: {user.username}")
            else:
                print(f"DEBUG: User found by username: {user.username}")

            print(f"DEBUG: Checking password for user: {user.username}")
            if not user.check_password(password):
                print(f"DEBUG: Password check failed for user: {user.username}")
                raise ValidationError({"detail": "Mật khẩu không đúng"})
            
            print(f"DEBUG: Password check passed for user: {user.username}")

            # Tạo JWT tokens, THÊM role
            payload = {
                'user_id': str(user.id),
                'username': user.username,
                'role': user.role,          # <-- thêm dòng này
                'exp': time.time() + 3600   # 1 hour
            }
            
            access_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            refresh_token = jwt.encode(
                {**payload, 'exp': time.time() + 86400},
                settings.SECRET_KEY,
                algorithm='HS256'
            )

            print(f"DEBUG: Tokens generated successfully for user: {user.username}")

            return {
                "access": access_token,
                "refresh": refresh_token,
                "user": {
                    "id": str(user.id),
                    "username": user.username,
                    "email": user.email,
                    "first_name": getattr(user, "first_name", "") or "",
                    "last_name": getattr(user, "last_name", "") or "",
                    "role": getattr(user, "role", "student"),
                    "class_name": getattr(user, "class_name", None),
                },
            }

        except ValidationError:
            raise
        except Exception as e:
            print(f"DEBUG: Login error: {str(e)}")
            raise ValidationError({"detail": "Login failed"})
