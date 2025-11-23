"""
Script đơn giản để tạo collection 'predictions' trong MongoDB
Chạy: python create_predictions_collection.py
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Setup environment variable trước khi import Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Predict_Learning_Web.settings')

# Import sau khi set environment
import django
django.setup()

# Bây giờ mới import models
from main.models import Prediction, User
from mongoengine.connection import get_db

def create_collection():
    """Tạo collection predictions nếu chưa tồn tại"""
    try:
        db = get_db()
        collections = db.list_collection_names()
        
        print("Checking MongoDB collections...")
        print(f"Existing collections: {collections}")
        
        if 'predictions' in collections:
            print("\n[OK] Collection 'predictions' already exists!")
            count = Prediction.objects.count()
            print(f"  - Documents in collection: {count}")
        else:
            print("\n[INFO] Collection 'predictions' does not exist yet.")
            print("Creating collection by saving a test document...")
            
            # Kiểm tra có user không
            users = User.objects.all()
            if users.count() == 0:
                print("\n[WARNING] No users found in database!")
                print("Please create a user first, then make a prediction.")
                print("The collection will be created automatically when you save your first prediction.")
                return
            
            # Lấy user đầu tiên
            test_user = users.first()
            print(f"Using test user: {test_user.username}")
            
            # Tạo document tạm thời để tạo collection
            temp_prediction = Prediction(
                user=test_user,
                study_hours_per_week=0.0,
                attendance_rate=0.0,
                past_exam_scores=0.0,
                parental_education_level="High School",
                internet_access_at_home="Yes",
                extracurricular_activities="No",
                predicted_score=0.0
            )
            temp_prediction.save()
            print("[OK] Collection 'predictions' created successfully!")
            
            # Xóa document test
            temp_prediction.delete()
            print("[OK] Test document removed.")
            
            # Verify collection exists
            collections_after = db.list_collection_names()
            if 'predictions' in collections_after:
                print("\n[SUCCESS] Collection 'predictions' is now ready to use!")
                print("\nYou can now:")
                print("1. Make predictions through the web interface")
                print("2. View prediction history")
                print("3. See the collection in MongoDB")
            else:
                print("\n[WARNING] Collection was not created. It will be created on first prediction save.")
        
        # Thông tin về indexes
        print("\n[INFO] Indexes will be created automatically when documents are saved:")
        print("  - Index on 'user' field")
        print("  - Index on 'created_at' field")  
        print("  - Compound index on ('user', '-created_at')")
        
    except Exception as e:
        print(f"\n[ERROR] {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    create_collection()

