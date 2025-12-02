from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import jwt
from django.conf import settings

from main.models import User, Prediction
from main.services.prediction_service import PredictionService


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

        token = auth_header.split(" ")[1].strip('"').strip("'")
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


class TeacherPredictView(TeacherRequiredMixin, APIView):
    """POST: Giáo viên dự đoán điểm cho học sinh"""

    authentication_classes = []
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Teacher - Predict score for a student",
        manual_parameters=[
            openapi.Parameter(
                "Authorization",
                openapi.IN_HEADER,
                description="Bearer token (teacher only)",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'student_id': openapi.Schema(type=openapi.TYPE_STRING, description='ID của học sinh'),
                'studyHoursPerWeek': openapi.Schema(type=openapi.TYPE_NUMBER, description='Số giờ học mỗi tuần'),
                'attendanceRate': openapi.Schema(type=openapi.TYPE_NUMBER, description='Tỉ lệ có mặt (%)'),
                'pastExamScores': openapi.Schema(type=openapi.TYPE_NUMBER, description='Điểm thi trước đó'),
                'parentalEducationLevel': openapi.Schema(type=openapi.TYPE_STRING, description='Trình độ giáo dục phụ huynh'),
                'internetAccessAtHome': openapi.Schema(type=openapi.TYPE_STRING, description='Có internet tại nhà'),
                'extracurricularActivities': openapi.Schema(type=openapi.TYPE_STRING, description='Hoạt động ngoại khóa'),
            },
            required=['student_id', 'studyHoursPerWeek', 'attendanceRate', 'pastExamScores', 
                     'parentalEducationLevel', 'internetAccessAtHome', 'extracurricularActivities']
        ),
        responses={200: "OK", 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden"},
    )
    def post(self, request):
        teacher, error_response = self.get_teacher_user(request)
        if error_response:
            return error_response

        # Validate student_id
        student_id = request.data.get('student_id')
        if not student_id:
            return Response(
                {"error": "student_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Find student
        student = User.objects(id=student_id).first()
        if not student or student.role != "student":
            return Response(
                {"error": "Student not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Verify student is in teacher's class
        if not getattr(teacher, "class_name", None) or student.class_name != teacher.class_name:
            return Response(
                {"error": "Student is not in your class"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Validate input data
        required_fields = [
            'studyHoursPerWeek',
            'attendanceRate', 
            'pastExamScores',
            'parentalEducationLevel',
            'internetAccessAtHome',
            'extracurricularActivities'
        ]
        
        missing_fields = [field for field in required_fields if field not in request.data]
        if missing_fields:
            return Response({
                "error": "Missing required fields",
                "details": f"Required fields: {', '.join(missing_fields)}"
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate data types and ranges
        try:
            study_hours = float(request.data.get('studyHoursPerWeek'))
            attendance = float(request.data.get('attendanceRate'))
            past_scores = float(request.data.get('pastExamScores'))
        except (ValueError, TypeError):
            return Response({
                "error": "Invalid data types",
                "details": "studyHoursPerWeek, attendanceRate, and pastExamScores must be numbers"
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate ranges
        if study_hours < 0 or study_hours > 168:
            return Response({
                "error": "Invalid studyHoursPerWeek",
                "details": "Must be between 0 and 168"
            }, status=status.HTTP_400_BAD_REQUEST)

        if attendance < 0 or attendance > 100:
            return Response({
                "error": "Invalid attendanceRate",
                "details": "Must be between 0 and 100"
            }, status=status.HTTP_400_BAD_REQUEST)

        if past_scores < 0 or past_scores > 100:
            return Response({
                "error": "Invalid pastExamScores",
                "details": "Must be between 0 and 100"
            }, status=status.HTTP_400_BAD_REQUEST)

        # Prepare input data
        input_data = {
            'studyHoursPerWeek': study_hours,
            'attendanceRate': attendance,
            'pastExamScores': past_scores,
            'parentalEducationLevel': str(request.data.get('parentalEducationLevel', '')),
            'internetAccessAtHome': str(request.data.get('internetAccessAtHome', '')),
            'extracurricularActivities': str(request.data.get('extracurricularActivities', '')),
        }

        try:
            # Make prediction
            predicted_score = PredictionService.predict(input_data)
            predicted_score_rounded = round(predicted_score, 2)

            # Save prediction to database for the student
            prediction = Prediction(
                user=student,
                study_hours_per_week=study_hours,
                attendance_rate=attendance,
                past_exam_scores=past_scores,
                parental_education_level=str(request.data.get('parentalEducationLevel', '')),
                internet_access_at_home=str(request.data.get('internetAccessAtHome', '')),
                extracurricular_activities=str(request.data.get('extracurricularActivities', '')),
                predicted_score=predicted_score_rounded
            )
            prediction.save()

            return Response({
                "predictedScore": predicted_score_rounded,
                "message": "Prediction successful",
                "inputData": input_data,
                "createdAt": prediction.created_at.isoformat() if prediction.created_at else None,
                "studentId": str(student.id),
                "studentName": f"{student.first_name} {student.last_name}".strip()
            }, status=status.HTTP_200_OK)

        except FileNotFoundError as e:
            return Response({
                "error": "Model files not found",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(f"DEBUG: TeacherPredictView error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                "error": "Internal server error",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
