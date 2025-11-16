from django.contrib.auth.hashers import make_password, check_password
from rest_framework.exceptions import ValidationError
from main.models import User
import time
import jwt
from django.conf import settings


class AuthService:

    @staticmethod
    def register_user(validated_data):
        try:
            username = validated_data["Username"]
            email = validated_data.get("Email", "")
            password = validated_data["Password"]

            print(f"DEBUG: Attempting to register user: {username}, {email}")

            # Kiểm tra username đã tồn tại (MongoEngine syntax)
            if User.objects(username=username).first():
                raise ValidationError({"Username": "Username already exists."})

            # Kiểm tra email đã tồn tại (nếu có)
            if email and User.objects(email=email).first():
                raise ValidationError({"Email": "Email already exists."})

            # Tạo user mới
            user = User(
                username=username,
                email=email,
                first_name="",
                last_name=""
            )
            user.set_password(password)
            user.save()
            
            print(f"DEBUG: User created successfully: {user.id}")
            return user

        except ValidationError:
            raise
        except Exception as e:
            print(f"DEBUG: Error creating user: {str(e)}")
            raise ValidationError({"error": f"Failed to create user: {str(e)}"})

    @staticmethod
    def login_user(username, password):
        try:
            print(f"DEBUG: Attempting to login user: {username}")
            
            # Tìm user với MongoEngine syntax
            user = User.objects(username=username).first()
            if not user:
                print(f"DEBUG: User not found: {username}")
                raise ValidationError({"detail": "Invalid username or password"})

            if not user.check_password(password):
                print(f"DEBUG: Password check failed for user: {username}")
                raise ValidationError({"detail": "Invalid username or password"})

            # Tạo JWT tokens
            payload = {
                'user_id': str(user.id),
                'username': user.username,
                'exp': time.time() + 3600  # 1 hour
            }
            
            access_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            refresh_token = jwt.encode({**payload, 'exp': time.time() + 86400}, settings.SECRET_KEY, algorithm='HS256')

            print(f"DEBUG: Tokens generated successfully for user: {username}")

            return {
                "access": access_token,
                "refresh": refresh_token,
                "user": {
                    "id": str(user.id),
                    "username": user.username,
                    "email": user.email,
                }
            }

        except ValidationError:
            raise
        except Exception as e:
            print(f"DEBUG: Login error: {str(e)}")
            raise ValidationError({"detail": "Login failed"})
