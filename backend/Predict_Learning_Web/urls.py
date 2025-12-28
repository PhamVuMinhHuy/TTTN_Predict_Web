from main.views.home_view import home
from main.views.auth_views import LoginView, ForgotPasswordRequestView, VerifyOTPView, ResetPasswordView
from main.views.profile_views import UserProfileView
from main.views.prediction_views import PredictView, PredictionHistoryView, DeletePredictionView
from main.views.score_student_views import ScoreStudentHistoryView
from main.views.admin_views import AdminUserListCreateView, AdminUserDetailView, AdminClassListCreateView, AdminClassDeleteView
from main.views.teacher_views import TeacherStudentListView, TeacherPredictView, TeacherSaveScoresView, TeacherGetAllScoresView, TeacherPredictionHistoryView, TeacherDeletePredictionView, TeacherSendPredictionEmailView, TeacherUpdateScoreView, TeacherDeleteScoreView
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/auth/forgot-password/', ForgotPasswordRequestView.as_view(), name='forgot-password'),
    path('api/auth/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('api/auth/reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('api/predict/', PredictView.as_view(), name='predict'),
    path('api/predictions/history/', PredictionHistoryView.as_view(), name='prediction-history'),
    path('api/predictions/<str:prediction_id>/', DeletePredictionView.as_view(), name='delete-prediction'),
    path('api/score-students/history/', ScoreStudentHistoryView.as_view(), name='score-student-history'),
    path('api/admin/users/', AdminUserListCreateView.as_view(), name='admin-users'),
    path('api/admin/users/<str:user_id>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('api/admin/classes/', AdminClassListCreateView.as_view(), name='admin-classes'),
    path('api/admin/classes/<str:class_id>/', AdminClassDeleteView.as_view(), name='admin-class-delete'),
    path('api/teacher/students/', TeacherStudentListView.as_view(), name='teacher-students'),
    path('api/teacher/predict/', TeacherPredictView.as_view(), name='teacher-predict'),
    path('api/teacher/save-scores/', TeacherSaveScoresView.as_view(), name='teacher-save-scores'),
    path('api/teacher/all-scores/', TeacherGetAllScoresView.as_view(), name='teacher-all-scores'),
    path('api/teacher/prediction-history/', TeacherPredictionHistoryView.as_view(), name='teacher-prediction-history'),
    path('api/teacher/prediction/<str:prediction_id>/', TeacherDeletePredictionView.as_view(), name='teacher-delete-prediction'),
    path('api/teacher/send-prediction-email/', TeacherSendPredictionEmailView.as_view(), name='teacher-send-prediction-email'),
    path('api/teacher/scores/<str:score_id>/', TeacherUpdateScoreView.as_view(), name='teacher-update-score'),
    path('api/teacher/scores/<str:score_id>/delete/', TeacherDeleteScoreView.as_view(), name='teacher-delete-score'),
]