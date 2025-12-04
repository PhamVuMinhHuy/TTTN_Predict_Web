from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.exceptions import ValidationError
import jwt
from django.conf import settings

from main.services.prediction_service import PredictionService
from main.models import User, Prediction, ScoreStudent


class PredictView(APIView):
    """
    API endpoint để dự đoán điểm thi cuối kỳ
    Yêu cầu: Bearer token trong Authorization header (optional - có thể public)
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Predict final exam score based on student data",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'studyHoursPerWeek': openapi.Schema(type=openapi.TYPE_NUMBER, description='Số giờ học mỗi tuần'),
                'attendanceRate': openapi.Schema(type=openapi.TYPE_NUMBER, description='Tỉ lệ có mặt (%)'),
                'pastExamScores': openapi.Schema(type=openapi.TYPE_NUMBER, description='Điểm thi trước đó'),
                'parentalEducationLevel': openapi.Schema(type=openapi.TYPE_STRING, description='Trình độ giáo dục phụ huynh'),
                'internetAccessAtHome': openapi.Schema(type=openapi.TYPE_STRING, description='Có internet tại nhà'),
                'extracurricularActivities': openapi.Schema(type=openapi.TYPE_STRING, description='Hoạt động ngoại khóa'),
            },
            required=['studyHoursPerWeek', 'attendanceRate', 'pastExamScores', 
                     'parentalEducationLevel', 'internetAccessAtHome', 'extracurricularActivities']
        ),
        responses={
            200: openapi.Response(
                description="Prediction successful",
                examples={
                    "application/json": {
                        "predictedScore": 85.5,
                        "message": "Prediction successful"
                    }
                }
            ),
            400: openapi.Response(
                description="Bad request - Invalid input data",
                examples={
                    "application/json": {
                        "error": "Invalid input data",
                        "details": "Missing required fields"
                    }
                }
            ),
            500: openapi.Response(
                description="Internal server error",
                examples={
                    "application/json": {
                        "error": "Internal server error",
                        "details": "Error message"
                    }
                }
            )
        }
    )
    def post(self, request):
        try:
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
            if study_hours < 0 or study_hours > 168:  # Max 24*7 hours
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

            print(f"DEBUG: PredictView - Input data: {input_data}")

            # Make prediction
            predicted_score = PredictionService.predict(input_data)
            predicted_score_rounded = round(predicted_score, 2)

            # Lưu prediction vào database nếu có user đăng nhập
            user = None
            auth_header = request.headers.get('Authorization')
            print(f"DEBUG: PredictView - Authorization header: {auth_header}")
            
            if auth_header and auth_header.startswith('Bearer '):
                try:
                    token = auth_header.split(' ')[1].strip('"')
                    print(f"DEBUG: PredictView - Token extracted: {token[:50]}...")
                    
                    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                    user_id = payload.get('user_id')
                    print(f"DEBUG: PredictView - User ID from token: {user_id}")
                    
                    user = User.objects(id=user_id).first()
                    if user:
                        print(f"DEBUG: PredictView - User found: {user.username}")
                        # Lưu prediction vào database (CHỈ Prediction, KHÔNG lưu ScoreStudent)
                        prediction = Prediction(
                            user=user,
                            study_hours_per_week=study_hours,
                            attendance_rate=attendance,
                            past_exam_scores=past_scores,
                            parental_education_level=str(request.data.get('parentalEducationLevel', '')),
                            internet_access_at_home=str(request.data.get('internetAccessAtHome', '')),
                            extracurricular_activities=str(request.data.get('extracurricularActivities', '')),
                            predicted_score=predicted_score_rounded,
                            predicted_by=None  # Self-prediction
                        )
                        prediction.save()
                        print(f"DEBUG: Prediction saved to database for user: {user.username}, ID: {prediction.id}")
                    else:
                        print(f"DEBUG: PredictView - User not found for ID: {user_id}")
                except jwt.ExpiredSignatureError as e:
                    print(f"DEBUG: PredictView - Token expired: {str(e)}")
                except jwt.InvalidTokenError as e:
                    print(f"DEBUG: PredictView - Invalid token: {str(e)}")
                except Exception as e:
                    print(f"DEBUG: Error saving prediction to database: {str(e)}")
                    import traceback
                    traceback.print_exc()
                    # Không fail request nếu lỗi lưu database, chỉ log
            else:
                print("DEBUG: PredictView - No Authorization header or invalid format")

            return Response({
                "predictedScore": predicted_score_rounded,
                "message": "Prediction successful",
                "inputData": input_data
            }, status=status.HTTP_200_OK)

        except FileNotFoundError as e:
            return Response({
                "error": "Model files not found",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(f"DEBUG: PredictView error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                "error": "Internal server error",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PredictionHistoryView(APIView):
    """
    API endpoint để lấy lịch sử dự đoán của user
    Yêu cầu: Bearer token trong Authorization header
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Get prediction history for current user",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Bearer token",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'limit',
                openapi.IN_QUERY,
                description="Number of predictions to return (default: 50)",
                type=openapi.TYPE_INTEGER,
                required=False
            ),
            openapi.Parameter(
                'offset',
                openapi.IN_QUERY,
                description="Number of predictions to skip (default: 0)",
                type=openapi.TYPE_INTEGER,
                required=False
            )
        ],
        responses={
            200: openapi.Response(
                description="Prediction history retrieved successfully",
                examples={
                    "application/json": {
                        "predictions": [
                            {
                                "id": "prediction_id",
                                "studyHoursPerWeek": 30,
                                "attendanceRate": 90,
                                "pastExamScores": 85,
                                "parentalEducationLevel": "Bachelors",
                                "internetAccessAtHome": "Yes",
                                "extracurricularActivities": "No",
                                "predictedScore": 75.5,
                                "createdAt": "2024-01-01T00:00:00Z"
                            }
                        ],
                        "total": 10,
                        "limit": 50,
                        "offset": 0
                    }
                }
            ),
            401: openapi.Response(
                description="Unauthorized - Invalid or missing token",
                examples={
                    "application/json": {
                        "error": "Authentication required"
                    }
                }
            )
        }
    )
    def get(self, request):
        try:
            # Lấy token từ header
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return Response({
                    "error": "Authentication required",
                    "details": "Authorization header missing or invalid"
                }, status=status.HTTP_401_UNAUTHORIZED)

            token = auth_header.split(' ')[1].strip('"')
            
            # Decode JWT token
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = payload.get('user_id')
            except jwt.ExpiredSignatureError:
                return Response({
                    "error": "Token expired"
                }, status=status.HTTP_401_UNAUTHORIZED)
            except jwt.InvalidTokenError as e:
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

            # Lấy limit và offset từ query params
            limit = int(request.query_params.get('limit', 50))
            offset = int(request.query_params.get('offset', 0))
            
            # Lấy predictions của user (CHỈ tự dự đoán, không bao gồm giáo viên dự đoán)
            predictions = Prediction.objects(user=user, predicted_by=None).order_by('-created_at').skip(offset).limit(limit)
            total = Prediction.objects(user=user, predicted_by=None).count()

            # Serialize predictions
            predictions_data = []
            for pred in predictions:
                predictions_data.append({
                    "id": str(pred.id),
                    "studyHoursPerWeek": pred.study_hours_per_week,
                    "attendanceRate": pred.attendance_rate,
                    "pastExamScores": pred.past_exam_scores,
                    "parentalEducationLevel": pred.parental_education_level,
                    "internetAccessAtHome": pred.internet_access_at_home,
                    "extracurricularActivities": pred.extracurricular_activities,
                    "predictedScore": pred.predicted_score,
                    "createdAt": pred.created_at.isoformat() if pred.created_at else None
                })

            return Response({
                "predictions": predictions_data,
                "total": total,
                "limit": limit,
                "offset": offset
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"DEBUG: PredictionHistoryView error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                "error": "Internal server error",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

