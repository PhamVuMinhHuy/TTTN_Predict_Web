from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
import jwt
from django.conf import settings

from main.models import User, Class


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

    def get(self, request):
        admin_user, error_response = self.get_admin_user(request)
        if error_response:
            return error_response

        # Pagination parameters
        try:
            page = int(request.query_params.get('page', 1))
            limit = int(request.query_params.get('limit', 10))
            search = request.query_params.get('search', '').strip()
            role_filter = request.query_params.get('role', '').strip()  # Filter by role
        except ValueError:
            page = 1
            limit = 10
            search = ''
            role_filter = ''

        # Ensure valid values
        page = max(1, page)
        limit = max(1, min(100, limit))  # Max 100 items per page

        # Build query
        users_query = User.objects.all()

        # Apply role filter if provided
        if role_filter and role_filter in ['student', 'teacher', 'admin']:
            users_query = users_query.filter(role=role_filter)

        # Apply search filter if provided
        if search:
            users_query = users_query.filter(
                __raw__={
                    '$or': [
                        {'username': {'$regex': search, '$options': 'i'}},
                        {'email': {'$regex': search, '$options': 'i'}},
                        {'first_name': {'$regex': search, '$options': 'i'}},
                        {'last_name': {'$regex': search, '$options': 'i'}},
                        {'class_name': {'$regex': search, '$options': 'i'}},
                    ]
                }
            )

        # Get total count before pagination
        total = users_query.count()
        total_pages = (total + limit - 1) // limit  # Ceiling division

        # Apply pagination
        skip = (page - 1) * limit
        users = users_query.order_by('-date_joined').skip(skip).limit(limit)

        data = []
        for u in users:
            # Ưu tiên lấy từ class_ref, fallback về class_name cũ
            class_name = None
            class_id = None
            if u.class_ref:
                class_name = u.class_ref.name
                class_id = str(u.class_ref.id)
            elif u.class_name:
                class_name = u.class_name
            
            data.append({
                "id": str(u.id),
                "username": u.username,
                "email": u.email,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "role": u.role,
                "class_id": class_id,
                "class_name": class_name,
                "date_joined": u.date_joined.isoformat() if u.date_joined else None,
            })

        # Calculate total statistics (not affected by pagination or search)
        total_all_users = User.objects.count()
        total_students = User.objects(role="student").count()
        total_teachers = User.objects(role="teacher").count()
        total_admins = User.objects(role="admin").count()

        return Response({
            "users": data,
            "pagination": {
                "total": total,
                "totalPages": total_pages,
                "currentPage": page,
                "limit": limit,
                "hasMore": page < total_pages,
            },
            "statistics": {
                "totalUsers": total_all_users,
                "students": total_students,
                "teachers": total_teachers,
                "admins": total_admins,
            }
        }, status=status.HTTP_200_OK)

    def post(self, request):
        admin_user, error_response = self.get_admin_user(request)
        if error_response:
            return error_response

        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email", "")
        first_name = request.data.get("first_name", "")
        last_name = request.data.get("last_name", "")
        role = request.data.get("role", "student")
        # Hỗ trợ cả class_id (mới) và class_name (cũ) để backward compatible
        class_id = request.data.get("class_id", "").strip()
        class_name = request.data.get("class_name", "").strip()

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

        # Tìm Class object
        class_ref = None
        class_name_result = None
        
        if role != "admin":
            if class_id:
                # Ưu tiên dùng class_id
                class_ref = Class.objects(id=class_id).first()
                if class_ref:
                    class_name_result = class_ref.name
            elif class_name:
                # Fallback: tìm theo class_name
                class_ref = Class.objects(name=class_name).first()
                if class_ref:
                    class_name_result = class_ref.name
                else:
                    # Nếu không tìm thấy, vẫn lưu class_name để backward compatible
                    class_name_result = class_name
            
            # Kiểm tra nếu role là teacher và lớp đã có giáo viên khác
            if role == "teacher" and class_ref:
                existing_teacher = User.objects(role="teacher", class_ref=class_ref).first()
                if existing_teacher:
                    return Response({
                        "error": f"Lớp '{class_ref.name}' đã có giáo viên '{existing_teacher.first_name or ''} {existing_teacher.last_name or ''}' ({existing_teacher.username}). Mỗi lớp chỉ được có 1 giáo viên."
                    }, status=status.HTTP_400_BAD_REQUEST)

        user = User(
            username=username,
            email=email or None,
            first_name=first_name,
            last_name=last_name,
            role=role if role in ['student', 'teacher', 'admin'] else 'student',
            class_ref=class_ref,
            class_name=class_name_result,  # Giữ để backward compatible
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
                "class_id": str(class_ref.id) if class_ref else None,
                "class_name": class_name_result,
            }
        }, status=status.HTTP_201_CREATED)


class AdminUserDetailView(AdminRequiredMixin, APIView):
    """
    GET: Lấy thông tin chi tiết user theo id
    PUT: Cập nhật thông tin user
    DELETE: Xóa user theo id
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        admin_user, error_response = self.get_admin_user(request)
        if error_response:
            return error_response

        user = User.objects(id=user_id).first()
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Lấy thông tin class
        class_name = None
        class_id = None
        if user.class_ref:
            class_name = user.class_ref.name
            class_id = str(user.class_ref.id)
        elif user.class_name:
            class_name = user.class_name

        return Response({
            "user": {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "class_id": class_id,
                "class_name": class_name,
                "date_joined": user.date_joined.isoformat() if user.date_joined else None,
            }
        }, status=status.HTTP_200_OK)

    def put(self, request, user_id):
        admin_user, error_response = self.get_admin_user(request)
        if error_response:
            return error_response

        user = User.objects(id=user_id).first()
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Lấy dữ liệu từ request
        email = request.data.get("email", "").strip()
        first_name = request.data.get("first_name", "").strip()
        last_name = request.data.get("last_name", "").strip()
        role = request.data.get("role", "").strip()
        class_id = request.data.get("class_id", "").strip()
        class_name = request.data.get("class_name", "").strip()
        password = request.data.get("password", "").strip()

        # Kiểm tra email trùng lặp (nếu thay đổi email)
        if email and email != user.email:
            existing_user = User.objects(email=email).first()
            if existing_user and str(existing_user.id) != user_id:
                return Response({
                    "error": "Email đã được sử dụng bởi người dùng khác"
                }, status=status.HTTP_400_BAD_REQUEST)
            user.email = email

        # Cập nhật các trường cơ bản (chấp nhận cả chuỗi rỗng)
        if "first_name" in request.data:
            user.first_name = first_name
        if "last_name" in request.data:
            user.last_name = last_name

        # Cập nhật role (nếu có)
        if role and role in ['student', 'teacher', 'admin']:
            # Không cho admin thay đổi role của chính mình
            if str(admin_user.id) == user_id and role != 'admin':
                return Response({
                    "error": "Không thể thay đổi role của chính mình"
                }, status=status.HTTP_400_BAD_REQUEST)
            user.role = role

        # Cập nhật class (nếu có)
        # Xác định role cuối cùng (role mới nếu có, nếu không thì giữ role cũ)
        final_role = role if role in ['student', 'teacher', 'admin'] else user.role
        
        if final_role != "admin":
            class_ref = None
            class_name_result = None
            
            if class_id:
                class_ref = Class.objects(id=class_id).first()
                if class_ref:
                    class_name_result = class_ref.name
            elif class_name:
                class_ref = Class.objects(name=class_name).first()
                if class_ref:
                    class_name_result = class_ref.name
                else:
                    class_name_result = class_name
            
            # Kiểm tra nếu role là teacher và lớp đã có giáo viên khác
            if final_role == "teacher" and class_ref:
                existing_teacher = User.objects(role="teacher", class_ref=class_ref).first()
                # Chỉ báo lỗi nếu giáo viên đã tồn tại KHÔNG PHẢI là user đang cập nhật
                if existing_teacher and str(existing_teacher.id) != user_id:
                    return Response({
                        "error": f"Lớp '{class_ref.name}' đã có giáo viên '{existing_teacher.first_name or ''} {existing_teacher.last_name or ''}' ({existing_teacher.username}). Mỗi lớp chỉ được có 1 giáo viên."
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            user.class_ref = class_ref
            user.class_name = class_name_result
        else:
            # Admin không cần class
            user.class_ref = None
            user.class_name = None

        # Cập nhật password (nếu có)
        if password:
            user.set_password(password)

        user.save()

        # Trả về dữ liệu user đã cập nhật
        return Response({
            "message": "Cập nhật thông tin người dùng thành công",
            "user": {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "class_id": str(user.class_ref.id) if user.class_ref else None,
                "class_name": user.class_name,
            }
        }, status=status.HTTP_200_OK)

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


class AdminClassListCreateView(AdminRequiredMixin, APIView):
    """
    GET: Lấy danh sách lớp học
    POST: Tạo lớp học mới
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        admin_user, error_response = self.get_admin_user(request)
        if error_response:
            return error_response

        classes = Class.objects.all().order_by('name')
        data = []
        for c in classes:
            # Đếm số học sinh và giáo viên trong lớp
            student_count = User.objects(role='student', class_name=c.name).count()
            teacher = User.objects(role='teacher', class_name=c.name).first()
            
            data.append({
                "id": str(c.id),
                "name": c.name,
                "student_count": student_count,
                "teacher_name": f"{teacher.first_name or ''} {teacher.last_name or ''}".strip() or teacher.username if teacher else None,
                "created_at": c.created_at.isoformat() if c.created_at else None,
            })
        return Response({"classes": data}, status=status.HTTP_200_OK)

    def post(self, request):
        admin_user, error_response = self.get_admin_user(request)
        if error_response:
            return error_response

        name = request.data.get("name", "").strip()
        
        if not name:
            return Response({
                "error": "Tên lớp là bắt buộc"
            }, status=status.HTTP_400_BAD_REQUEST)

        if Class.objects(name=name).first():
            return Response({
                "error": f"Lớp '{name}' đã tồn tại"
            }, status=status.HTTP_400_BAD_REQUEST)

        new_class = Class(name=name)
        new_class.save()

        return Response({
            "message": f"Tạo lớp '{name}' thành công",
            "class": {
                "id": str(new_class.id),
                "name": new_class.name,
                "created_at": new_class.created_at.isoformat() if new_class.created_at else None,
            }
        }, status=status.HTTP_201_CREATED)


class AdminClassDeleteView(AdminRequiredMixin, APIView):
    """
    DELETE: Xóa lớp theo id
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def delete(self, request, class_id):
        admin_user, error_response = self.get_admin_user(request)
        if error_response:
            return error_response

        class_obj = Class.objects(id=class_id).first()
        if not class_obj:
            return Response({"error": "Lớp không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

        # Kiểm tra xem có user nào đang dùng lớp này không
        users_in_class = User.objects(class_name=class_obj.name).count()
        if users_in_class > 0:
            return Response({
                "error": f"Không thể xóa lớp '{class_obj.name}' vì còn {users_in_class} người dùng trong lớp này"
            }, status=status.HTTP_400_BAD_REQUEST)

        class_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)