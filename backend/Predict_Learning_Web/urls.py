from main.views.home_view import home
from main.views.auth_views import RegisterView, LoginView
from main.views.profile_views import UserProfileView
from main.views.prediction_views import PredictView
from django.contrib import admin
from django.urls import path, re_path
from .swagger import schema_view

urlpatterns = [
    path('admin/', admin.site.urls),  # admin site
    path('', home, name='home'),      # trang chủ
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),  # API lấy thông tin user
    path('api/predict/', PredictView.as_view(), name='predict'),  # API dự đoán điểm
    
    # Swagger URLs
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]