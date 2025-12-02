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
            name = validated_data.get("Name", "")

            print(f"DEBUG: Register data received: {validated_data}")
            print(f"DEBUG: Attempting to register user: {username}, email: {email}, name: {name}")

            # Kiểm tra username đã tồn tại
            existing_user = User.objects(username=username).first()
            if existing_user:
                print(f"DEBUG: Username {username} already exists")
                raise ValidationError({"Username": "Username already exists."})

            # Kiểm tra email đã tồn tại (nếu có)
            if email and email.strip():
                existing_email = User.objects(email=email.strip()).first()
                if existing_email:
                    print(f"DEBUG: Email {email} already exists")
                    raise ValidationError({"Email": "Email already exists."})

            # Tạo user mới - xử lý email rỗng
            user_data = {
                "username": username,
                "first_name": name,
                "last_name": "",
                "role": "student",
            }
            # Chỉ set email nếu không rỗng
            if email and email.strip():
                user_data["email"] = email.strip()
            
            user = User(**user_data)
            # Set password trước khi save (password_hash là required field)
            user.set_password(password)
            
            # Kiểm tra password_hash đã được set
            if not user.password_hash:
                print(f"DEBUG: ERROR - password_hash is not set!")
                raise ValidationError({"error": "Failed to set password"})
            
            print(f"DEBUG: User object before save - username={user.username}, email={user.email}, password_hash set={bool(user.password_hash)}")
            
            # Lưu user vào database với force_insert để đảm bảo tạo mới
            try:
                # Sử dụng force_insert=True để đảm bảo đây là insert mới, không phải update
                user.save(force_insert=True)
                print(f"DEBUG: User.save(force_insert=True) called successfully")
            except Exception as save_error:
                print(f"DEBUG: ERROR during user.save(): {str(save_error)}")
                import traceback
                traceback.print_exc()
                # Nếu force_insert fails (có thể do duplicate), thử save() thông thường
                try:
                    user.save()
                    print(f"DEBUG: User.save() (without force_insert) succeeded")
                except Exception as save_error2:
                    print(f"DEBUG: ERROR during user.save() (retry): {str(save_error2)}")
                    raise ValidationError({"error": f"Failed to save user to database: {str(save_error2)}"})
            
            # Verify user was saved by checking if ID exists
            if not user.id:
                print(f"DEBUG: ERROR - User ID is None after save!")
                raise ValidationError({"error": "User was not saved - no ID assigned"})
            
            print(f"DEBUG: User saved to database with ID: {user.id}")
            print(f"DEBUG: User data: username={user.username}, email={user.email}, first_name={user.first_name}")
            
            # Verify user was saved by querying database
            verify_user = User.objects(id=user.id).first()
            if verify_user:
                print(f"DEBUG: User verification successful: {verify_user.username} (ID: {verify_user.id})")
            else:
                print(f"DEBUG: ERROR - User verification failed - user not found in database after save!")
                raise ValidationError({"error": "User was not saved to database"})
            
            return user

        except ValidationError:
            raise
        except Exception as e:
            print(f"DEBUG: Error creating user: {str(e)}")
            raise ValidationError({"error": f"Failed to create user: {str(e)}"})

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
                    raise ValidationError({"detail": "Invalid username or password"})
                else:
                    print(f"DEBUG: User found by email: {user.username}")
            else:
                print(f"DEBUG: User found by username: {user.username}")

            print(f"DEBUG: Checking password for user: {user.username}")
            if not user.check_password(password):
                print(f"DEBUG: Password check failed for user: {user.username}")
                raise ValidationError({"detail": "Invalid username or password"})
            
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
                    "role": getattr(user, "role", "student"),
                    "class_name": getattr(user, "class_name", None),
                },
            }

        except ValidationError:
            raise
        except Exception as e:
            print(f"DEBUG: Login error: {str(e)}")
            raise ValidationError({"detail": "Login failed"})
