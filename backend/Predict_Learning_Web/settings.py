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

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1,testserver').split(',')

# Application definition - chỉ cần tối thiểu
INSTALLED_APPS = [
    'django.contrib.contenttypes',  # Cần thiết cho Django
    'django.contrib.staticfiles',
    
    # MongoDB
    'mongoengine',
    
    # Your apps
    'main',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'Predict_Learning_Web.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
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
except Exception as e:
    print(f"❌ Failed to connect to MongoDB Atlas: {e}")


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
