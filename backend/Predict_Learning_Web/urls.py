"""
URL configuration for Predict_Learning_Web project - MongoDB Test Only
"""
from django.urls import path
from main import views

urlpatterns = [
    # Test endpoint only
    path('api/test/', views.test_connection, name='test_connection'),
    path('', views.test_connection, name='home'),  # Root endpoint cũng test
]