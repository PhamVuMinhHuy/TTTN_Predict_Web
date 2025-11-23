"""
Script để khởi tạo collection 'predictions' trong MongoDB
Chạy script này để tạo collection và indexes trước khi sử dụng
"""
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Predict_Learning_Web.settings')
django.setup()

from mongoengine import connect
from django.conf import settings
from main.models import Prediction, User

def init_predictions_collection():
    """Khởi tạo collection predictions và tạo indexes"""
    try:
        # Kết nối MongoDB
        db_name = settings.MONGODB_DATABASE.get('name', 'PredictLearning')
        db_host = settings.MONGODB_DATABASE.get('host', 'localhost')
        db_port = settings.MONGODB_DATABASE.get('port', 27017)
        
        print(f"Connecting to MongoDB: {db_host}:{db_port}/{db_name}")
        
        # Tạo collection bằng cách tạo một document tạm thời rồi xóa
        # Hoặc chỉ cần đảm bảo model được import và indexes được tạo
        
        # Kiểm tra xem có user nào không
        users = User.objects.all()
        if users.count() == 0:
            print("⚠️  Warning: No users found in database.")
            print("   Collection will be created automatically when first prediction is saved.")
            print("   Creating empty collection structure...")
        else:
            print(f"✓ Found {users.count()} user(s) in database")
        
        # Tạo indexes cho Prediction model
        # MongoEngine sẽ tự động tạo indexes khi model được định nghĩa
        # Nhưng chúng ta có thể force create bằng cách tạo một document tạm thời
        
        # Kiểm tra xem collection đã tồn tại chưa
        from mongoengine.connection import get_db
        db = get_db()
        collections = db.list_collection_names()
        
        if 'predictions' in collections:
            print("✓ Collection 'predictions' already exists")
            # Đếm số documents
            count = Prediction.objects.count()
            print(f"  - Current documents: {count}")
        else:
            print("⚠️  Collection 'predictions' does not exist yet")
            print("   It will be created automatically when first prediction is saved.")
            
            # Tạo collection bằng cách tạo và xóa một document tạm thời
            if users.count() > 0:
                test_user = users.first()
                try:
                    # Tạo document tạm thời để khởi tạo collection
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
                    print("✓ Created collection 'predictions' with test document")
                    
                    # Xóa document tạm thời
                    temp_prediction.delete()
                    print("✓ Removed test document")
                    print("✓ Collection 'predictions' is now ready to use")
                except Exception as e:
                    print(f"⚠️  Error creating test document: {str(e)}")
                    print("   Collection will be created automatically on first real prediction")
            else:
                print("   Cannot create collection without users. Please create a user first.")
        
        # Tạo indexes (MongoEngine sẽ tự động tạo khi save document)
        print("\n✓ Indexes will be created automatically when first document is saved:")
        print("  - Index on 'user'")
        print("  - Index on 'created_at'")
        print("  - Compound index on ('user', '-created_at')")
        
        print("\n✅ Initialization complete!")
        print("\nNext steps:")
        print("1. Make sure Django server is running")
        print("2. Login to your account")
        print("3. Make a prediction - it will be saved to 'predictions' collection")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    init_predictions_collection()

