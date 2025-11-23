"""
Script để kiểm tra predictions trong database
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Predict_Learning_Web.settings')
django.setup()

from main.models import Prediction, User

def check_predictions():
    """Kiểm tra predictions trong database"""
    try:
        # Đếm số predictions
        total = Prediction.objects.count()
        print(f"Total predictions in database: {total}")
        
        if total > 0:
            print("\nRecent predictions:")
            predictions = Prediction.objects.order_by('-created_at').limit(10)
            for i, pred in enumerate(predictions, 1):
                print(f"\n{i}. Prediction ID: {pred.id}")
                print(f"   User: {pred.user.username}")
                print(f"   Study Hours: {pred.study_hours_per_week}")
                print(f"   Attendance Rate: {pred.attendance_rate}")
                print(f"   Past Exam Scores: {pred.past_exam_scores}")
                print(f"   Parental Education: {pred.parental_education_level}")
                print(f"   Internet Access: {pred.internet_access_at_home}")
                print(f"   Extracurricular: {pred.extracurricular_activities}")
                print(f"   Predicted Score: {pred.predicted_score}")
                print(f"   Created At: {pred.created_at}")
        else:
            print("\nNo predictions found in database.")
            print("This means predictions are not being saved.")
            print("\nPossible reasons:")
            print("1. User is not logged in (no token sent)")
            print("2. Token is invalid or expired")
            print("3. Error when saving to database (check server logs)")
        
        # Kiểm tra users
        user_count = User.objects.count()
        print(f"\nTotal users in database: {user_count}")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_predictions()

