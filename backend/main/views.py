from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import User
import secrets

# Create your views here.

@csrf_exempt  
@require_http_methods(["GET"])
def test_connection(request):
    """Test MongoDB connection"""
    try:
        # Test creating a user
        test_user = User(
            username=f'test_user_{secrets.token_hex(8)}',
            email=f'test_{secrets.token_hex(8)}@example.com',
            first_name='Test',
            last_name='User'
        )
        test_user.set_password('test123')
        test_user.save()
        
        # Test reading
        found_user = User.objects(id=test_user.id).first()
        
        # Test deleting
        test_user.delete()
        
        return JsonResponse({
            'message': 'MongoDB connection test successful!',
            'test_user_created': str(test_user.id),
            'test_user_found': found_user.username if found_user else 'Not found',
            'status': 'Connected to MongoDB Atlas',
            'database': 'PredictLearning',
            'collection': 'users'
        }, status=200)
        
    except Exception as e:
        return JsonResponse({
            'error': f'MongoDB connection test failed: {str(e)}',
            'status': 'Failed to connect to MongoDB Atlas'
        }, status=500)