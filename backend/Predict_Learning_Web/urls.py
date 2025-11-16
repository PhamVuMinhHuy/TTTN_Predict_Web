from main.views.home_view import home
from main.views.auth_views import RegisterView, LoginView
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),  # admin site
    path('', home, name='home'),      # trang chủ
    path('admin/register/', RegisterView.as_view(), name='register'),
    path('admin/login/', LoginView.as_view(), name='login'),
]