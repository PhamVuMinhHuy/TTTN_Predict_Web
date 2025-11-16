"""
Django settings for Predict_Learning_Web project - MongoDB Only
"""

from pathlib import Path
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-cp0l42ihb=3t_qk#4fc#!!o&h1tvft=t!e&mk)+-wkv4gk)y6s')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'testserver', '*']

# If environment variable is set, add those hosts as well
if os.getenv('ALLOWED_HOSTS'):
    env_hosts = os.getenv('ALLOWED_HOSTS').split(',')
    ALLOWED_HOSTS.extend([host.strip() for host in env_hosts if host.strip() not in ALLOWED_HOSTS])

# Application definition - chỉ cần tối thiểu
INSTALLED_APPS = [
    'django.contrib.admin',       # quản trị Django
    'django.contrib.auth',        # bắt buộc cho user, permission
    'django.contrib.contenttypes',  
    'django.contrib.sessions',    # cần thiết nếu dùng session
    'django.contrib.messages',    # cần thiết cho message framework
    'django.contrib.staticfiles', 
    'corsheaders',               # CORS support
    'rest_framework',            # Django REST Framework
    'drf_yasg',  # Thêm dòng này
    'mongoengine',               # MongoDB
    'main',
]

# Thêm cấu hình cho drf-yasg
SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    }
}

# Tìm INSTALLED_APPS và thêm 'corsheaders' nếu chưa có
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',  # Thêm dòng này
    'rest_framework',
    'drf_yasg',
    'mongoengine',
    'main',
]

# Tìm MIDDLEWARE và thêm CORS middleware ở đầu
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Thêm dòng này ở đầu
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'Predict_Learning_Web.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # nếu có thư mục templates
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',      
                'django.contrib.messages.context_processors.messages',  
            ],
        },
    },
]

WSGI_APPLICATION = 'Predict_Learning_Web.wsgi.application'

# Không sử dụng database SQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.dummy',
    }
}

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = 'static/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# MongoDB Atlas connection
import mongoengine

MONGO_DB_USERNAME = os.getenv('MONGO_DB_USERNAME', 'doubleHuy')
MONGO_DB_PASSWORD = os.getenv('MONGO_DB_PASSWORD', 'doubleHuy224712')
MONGO_CLUSTER_URL = os.getenv('MONGO_CLUSTER_URL', 'predictlearning.uq08cwt.mongodb.net')
MONGO_DATABASE_NAME = os.getenv('MONGO_DATABASE_NAME', 'PredictLearning')

# Construct MongoDB Atlas connection string
MONGODB_URI = f"mongodb+srv://{MONGO_DB_USERNAME}:{MONGO_DB_PASSWORD}@{MONGO_CLUSTER_URL}/?retryWrites=true&w=majority&appName=PredictLearning"

# Connect to MongoDB Atlas
try:
    mongoengine.connect(
        db=MONGO_DATABASE_NAME,
        host=MONGODB_URI,
        alias='default'
    )
    print("✅ Successfully connected to MongoDB Atlas!")
    
    # Test connection
    from main.models import User
    test_count = User.objects.count()
    print(f"✅ Current user count in database: {test_count}")
    
except Exception as e:
    print(f"❌ Failed to connect to MongoDB Atlas: {e}")


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
    "http://localhost:5174",  # Current port
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True  # Chỉ dùng cho development

# Thêm CORS headers
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Swagger/OpenAPI settings
SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    }
}

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
