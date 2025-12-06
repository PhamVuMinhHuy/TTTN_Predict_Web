from mongoengine import Document, fields
from datetime import datetime
import hashlib

class User(Document):
    """Simple User model for MongoDB connection test"""
    username = fields.StringField(required=True, unique=True, max_length=150)
    email = fields.EmailField(required=False, unique=False)  # Sửa required=False
    password_hash = fields.StringField(required=True, max_length=255)
    first_name = fields.StringField(max_length=30)
    last_name = fields.StringField(max_length=30)
    date_joined = fields.DateTimeField(default=datetime.utcnow)
    role = fields.StringField(
        required=True,
        choices=['student', 'teacher', 'admin'],
        default='student',
        max_length=20,
    )
    class_name = fields.StringField(max_length=50)  # <-- chỉ 1 dòng này để thêm Lớp

    meta = {
        'collection': 'users'
        # Bỏ indexes để tránh conflict
    }
    
    def set_password(self, raw_password):
        """Hash and set password"""
        self.password_hash = hashlib.sha256(raw_password.encode()).hexdigest()
    
    def check_password(self, raw_password):
        """Check if provided password matches"""
        return self.password_hash == hashlib.sha256(raw_password.encode()).hexdigest()
    
    def __str__(self):
        return self.username


class Prediction(Document):
    """Model để lưu lịch sử dự đoán điểm của user"""
    user = fields.ReferenceField(User, required=True)
    # Input data
    study_hours_per_week = fields.FloatField(required=True)
    attendance_rate = fields.FloatField(required=True)
    past_exam_scores = fields.FloatField(required=True)
    parental_education_level = fields.StringField(required=True)
    internet_access_at_home = fields.StringField(required=True)
    extracurricular_activities = fields.StringField(required=True)
    # Output
    predicted_score = fields.FloatField(required=True)
    # Metadata
    predicted_by = fields.ReferenceField(User, required=False)  # null = self-prediction, teacher_id = teacher prediction
    created_at = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'predictions',
        'indexes': [
            'user',
            'created_at',
            'predicted_by',
            ('user', '-created_at')  # Compound index để query nhanh hơn
        ]
    }
    
    def __str__(self):
        return f"Prediction for {self.user.username} - Score: {self.predicted_score}"


class ScoreStudent(Document):
    """Lưu riêng dữ liệu đầu vào cho mỗi lần dự đoán"""
    user = fields.ReferenceField(User, required=True)
    study_hours_per_week = fields.FloatField(required=True)
    attendance_rate = fields.FloatField(required=True)
    past_exam_scores = fields.FloatField(required=True)
    parental_education_level = fields.StringField(required=True)
    internet_access_at_home = fields.StringField(required=True)
    extracurricular_activities = fields.StringField(required=True)
    created_at = fields.DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'score_students',
        'indexes': [
            'user',
            'created_at',
            ('user', '-created_at'),
        ],
    }


class PasswordResetOTP(Document):
    """Model để lưu mã OTP cho reset password"""
    email = fields.EmailField(required=True)
    otp_code = fields.StringField(required=True, max_length=6)
    created_at = fields.DateTimeField(default=datetime.utcnow)
    expires_at = fields.DateTimeField(required=True)
    is_verified = fields.BooleanField(default=False)
    
    meta = {
        'collection': 'password_reset_otps',
        'indexes': ['email', 'created_at']
    }
    
    def __str__(self):
        return f"OTP for {self.email} - {self.otp_code}"