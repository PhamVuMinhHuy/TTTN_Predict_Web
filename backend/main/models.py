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