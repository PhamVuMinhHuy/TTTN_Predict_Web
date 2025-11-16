from main.views.home_view import home
from main.views.auth_views import RegisterView, LoginView
from django.contrib import admin
from django.urls import path, re_path
from .swagger import schema_view

urlpatterns = [
    path('admin/', admin.site.urls),  # admin site
    path('', home, name='home'),      # trang chủ
<<<<<<< HEAD
    path('admin/register/', RegisterView.as_view(), name='register'),
    path('admin/login/', LoginView.as_view(), name='login'),
=======
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    
    # Swagger URLs
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
>>>>>>> dd4e9d0c946861290bb367042d8157a0c4422d84
]