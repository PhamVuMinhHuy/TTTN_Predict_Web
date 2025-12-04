from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import jwt
from django.conf import settings

from main.models import User, ScoreStudent


class ScoreStudentHistoryView(APIView):
    """API lấy lịch sử các lần nhập dữ liệu (input) của học sinh.

    Chỉ trả về các trường đầu vào, không trả kết quả dự đoán.
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Lấy lịch sử ScoreStudent (các lần nhập input) cho học sinh hiện tại",
        manual_parameters=[
            openapi.Parameter(
                "Authorization",
                openapi.IN_HEADER,
                description="Bearer token (student)",
                type=openapi.TYPE_STRING,
                required=True,
            ),
            openapi.Parameter(
                "limit",
                openapi.IN_QUERY,
                description="Số bản ghi tối đa (mặc định 50, tối đa 100)",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
            openapi.Parameter(
                "offset",
                openapi.IN_QUERY,
                description="Bỏ qua N bản ghi đầu (mặc định 0)",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
        ],
        responses={
            200: openapi.Response(
                description="Lấy dữ liệu ScoreStudent thành công",
            ),
            401: openapi.Response(
                description="Unauthorized - Thiếu hoặc token không hợp lệ",
            ),
        },
    )
    def get(self, request):
        try:
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return Response(
                    {
                        "error": "Authentication required",
                        "details": "Authorization header missing or invalid",
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            token = auth_header.split(" ")[1].strip('"')

            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = payload.get("user_id")
            except jwt.ExpiredSignatureError:
                return Response(
                    {"error": "Token expired"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            except jwt.InvalidTokenError as e:
                return Response(
                    {"error": "Invalid token", "details": str(e)},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            user = User.objects(id=user_id).first()
            if not user:
                return Response(
                    {"error": "User not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            try:
                limit = int(request.query_params.get("limit", 50))
                offset = int(request.query_params.get("offset", 0))
            except ValueError:
                limit = 50
                offset = 0

            limit = max(1, min(limit, 100))
            offset = max(0, offset)

            queryset = (
                ScoreStudent.objects(user=user)
                .order_by("-created_at")
                .skip(offset)
                .limit(limit)
            )
            total = ScoreStudent.objects(user=user).count()

            items = []
            for s in queryset:
                items.append(
                    {
                        "id": str(s.id),
                        "studyHoursPerWeek": s.study_hours_per_week,
                        "attendanceRate": s.attendance_rate,
                        "pastExamScores": s.past_exam_scores,
                        "parentalEducationLevel": s.parental_education_level,
                        "internetAccessAtHome": s.internet_access_at_home,
                        "extracurricularActivities": s.extracurricular_activities,
                        "createdAt": s.created_at.isoformat() if s.created_at else None,
                    }
                )

            return Response(
                {"items": items, "total": total, "limit": limit, "offset": offset},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            print(f"DEBUG: ScoreStudentHistoryView error: {str(e)}")
            import traceback

            traceback.print_exc()
            return Response(
                {"error": "Internal server error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
