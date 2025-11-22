from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.exceptions import ValidationError

from main.services.prediction_service import PredictionService


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

            return Response({
                "predictedScore": round(predicted_score, 2),
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

