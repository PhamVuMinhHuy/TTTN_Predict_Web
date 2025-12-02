from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import jwt
from django.conf import settings

from main.models import User, Prediction


class TeacherRequiredMixin:
    """Helper để kiểm tra token + role teacher"""

    def get_teacher_user(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None, Response(
                {
                    "error": "Authentication required",
                    "details": "Authorization header missing or invalid",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token = auth_header.split(" ")[1].strip("\"").strip("'")
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return None, Response({"error": "Token expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError as e:
            return None, Response(
                {"error": "Invalid token", "details": str(e)},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user_id = payload.get("user_id")
        if not user_id:
            return None, Response(
                {"error": "Invalid token payload"}, status=status.HTTP_401_UNAUTHORIZED
            )

        teacher = User.objects(id=user_id).first()
        if not teacher or teacher.role != "teacher":
            return None, Response(
                {"error": "Teacher role required"}, status=status.HTTP_403_FORBIDDEN
            )

        return teacher, None


class TeacherStudentListView(TeacherRequiredMixin, APIView):
    """GET: Lấy danh sách học sinh cùng class với giáo viên"""

    authentication_classes = []
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Teacher - Get students in same class",
        manual_parameters=[
            openapi.Parameter(
                "Authorization",
                openapi.IN_HEADER,
                description="Bearer token (teacher only)",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ],
        responses={200: "OK", 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden"},
    )
    def get(self, request):
        teacher, error_response = self.get_teacher_user(request)
        if error_response:
            return error_response

        if not getattr(teacher, "class_name", None):
            return Response(
                {"error": "Teacher does not have class_name set"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        students = User.objects(role="student", class_name=teacher.class_name)
        data = []
        for s in students:
            last_pred = (
                Prediction.objects(user=s).order_by("-created_at").first()
            )
            data.append(
                {
                    "id": str(s.id),
                    "username": s.username,
                    "first_name": s.first_name,
                    "last_name": s.last_name,
                    "email": s.email,
                    "class_name": getattr(s, "class_name", None),
                    "last_score": last_pred.predicted_score if last_pred else None,
                    "last_predicted_at": last_pred.created_at.isoformat()
                    if last_pred and last_pred.created_at
                    else None,
                }
            )

        return Response({"students": data}, status=status.HTTP_200_OK)
