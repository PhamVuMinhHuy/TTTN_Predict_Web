from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import jwt
from django.conf import settings

from main.models import User, Prediction, ScoreStudent
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

            # Save prediction to database for the student (CHỈ Prediction, KHÔNG lưu ScoreStudent)
            prediction = Prediction(
                user=student,
                study_hours_per_week=study_hours,
                attendance_rate=attendance,
                past_exam_scores=past_scores,
                parental_education_level=str(request.data.get('parentalEducationLevel', '')),
                internet_access_at_home=str(request.data.get('internetAccessAtHome', '')),
                extracurricular_activities=str(request.data.get('extracurricularActivities', '')),
                predicted_score=predicted_score_rounded,
                predicted_by=teacher  # Teacher made this prediction
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


class TeacherSaveScoresView(TeacherRequiredMixin, APIView):
    """POST: Giáo viên nhập điểm cho học sinh (chỉ lưu input, không dự đoán)"""

    authentication_classes = []
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Teacher - Save student scores (input data only, no prediction)",
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

        try:
            # Lưu input vào ScoreStudent (KHÔNG dự đoán)
            score_student = ScoreStudent(
                user=student,
                study_hours_per_week=study_hours,
                attendance_rate=attendance,
                past_exam_scores=past_scores,
                parental_education_level=str(request.data.get('parentalEducationLevel', '')),
                internet_access_at_home=str(request.data.get('internetAccessAtHome', '')),
                extracurricular_activities=str(request.data.get('extracurricularActivities', '')),
            )
            score_student.save()

            return Response({
                "message": "Scores saved successfully",
                "data": {
                    "id": str(score_student.id),
                    "studentId": str(student.id),
                    "studentName": f"{student.first_name} {student.last_name}".strip(),
                    "studyHoursPerWeek": study_hours,
                    "attendanceRate": attendance,
                    "pastExamScores": past_scores,
                    "parentalEducationLevel": str(request.data.get('parentalEducationLevel', '')),
                    "internetAccessAtHome": str(request.data.get('internetAccessAtHome', '')),
                    "extracurricularActivities": str(request.data.get('extracurricularActivities', '')),
                    "createdAt": score_student.created_at.isoformat() if score_student.created_at else None,
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"DEBUG: TeacherSaveScoresView error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                "error": "Internal server error",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TeacherGetAllScoresView(TeacherRequiredMixin, APIView):
    """GET: Lấy tất cả ScoreStudent của học sinh trong lớp"""

    authentication_classes = []
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Teacher - Get all ScoreStudent records for students in class",
        manual_parameters=[
            openapi.Parameter(
                "Authorization",
                openapi.IN_HEADER,
                description="Bearer token (teacher only)",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ],
        responses={200: "OK", 401: "Unauthorized", 403: "Forbidden"},
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

        # Get all students in teacher's class
        students = User.objects(role="student", class_name=teacher.class_name)
        
        result = []
        for student in students:
            # Get all ScoreStudent records for this student
            scores = ScoreStudent.objects(user=student).order_by("-created_at")
            
            student_scores = []
            for score in scores:
                student_scores.append({
                    "id": str(score.id),
                    "studyHoursPerWeek": score.study_hours_per_week,
                    "attendanceRate": score.attendance_rate,
                    "pastExamScores": score.past_exam_scores,
                    "parentalEducationLevel": score.parental_education_level,
                    "internetAccessAtHome": score.internet_access_at_home,
                    "extracurricularActivities": score.extracurricular_activities,
                    "createdAt": score.created_at.isoformat() if score.created_at else None,
                })
            
            result.append({
                "studentId": str(student.id),
                "username": student.username,
                "firstName": student.first_name,
                "lastName": student.last_name,
                "className": getattr(student, "class_name", None),
                "scores": student_scores,
                "totalScores": len(student_scores),
            })

        return Response({
            "students": result,
            "totalStudents": len(result)
        }, status=status.HTTP_200_OK)


class TeacherPredictionHistoryView(TeacherRequiredMixin, APIView):
    """GET: Lấy lịch sử dự đoán của giáo viên"""

    authentication_classes = []
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Teacher - Get prediction history made by teacher",
        manual_parameters=[
            openapi.Parameter(
                "Authorization",
                openapi.IN_HEADER,
                description="Bearer token (teacher only)",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ],
        responses={200: "OK", 401: "Unauthorized", 403: "Forbidden"},
    )
    def get(self, request):
        teacher, error_response = self.get_teacher_user(request)
        if error_response:
            return error_response

        # Get all predictions made by this teacher
        predictions = Prediction.objects(predicted_by=teacher).order_by("-created_at")
        
        result = []
        for pred in predictions:
            student = pred.user
            result.append({
                "id": str(pred.id),
                "studentId": str(student.id),
                "studentUsername": student.username,
                "studentName": f"{student.first_name} {student.last_name}".strip() or student.username,
                "className": getattr(student, "class_name", None),
                "studyHoursPerWeek": pred.study_hours_per_week,
                "attendanceRate": pred.attendance_rate,
                "pastExamScores": pred.past_exam_scores,
                "parentalEducationLevel": pred.parental_education_level,
                "internetAccessAtHome": pred.internet_access_at_home,
                "extracurricularActivities": pred.extracurricular_activities,
                "predictedScore": pred.predicted_score,
                "createdAt": pred.created_at.isoformat() if pred.created_at else None,
            })

        return Response({
            "predictions": result,
            "total": len(result)
        }, status=status.HTTP_200_OK)


class TeacherDeletePredictionView(TeacherRequiredMixin, APIView):
    """DELETE: Xóa prediction của giáo viên"""

    authentication_classes = []
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Teacher - Delete a prediction record",
        manual_parameters=[
            openapi.Parameter(
                "Authorization",
                openapi.IN_HEADER,
                description="Bearer token (teacher only)",
                type=openapi.TYPE_STRING,
                required=True,
            ),
            openapi.Parameter(
                "prediction_id",
                openapi.IN_PATH,
                description="Prediction ID to delete",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ],
        responses={200: "OK", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found"},
    )
    def delete(self, request, prediction_id):
        teacher, error_response = self.get_teacher_user(request)
        if error_response:
            return error_response

        try:
            # Find prediction
            prediction = Prediction.objects(id=prediction_id).first()
            if not prediction:
                return Response(
                    {"error": "Prediction not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Verify this prediction was made by this teacher
            if not prediction.predicted_by or str(prediction.predicted_by.id) != str(teacher.id):
                return Response(
                    {"error": "You can only delete your own predictions"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Delete prediction
            prediction.delete()

            return Response({
                "message": "Prediction deleted successfully",
                "deletedId": prediction_id
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"DEBUG: TeacherDeletePredictionView error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                "error": "Internal server error",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
