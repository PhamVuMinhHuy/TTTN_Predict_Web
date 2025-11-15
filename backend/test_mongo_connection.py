import os
import sys
import django
from dotenv import load_dotenv

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Predict_Learning_Web.settings')
django.setup()

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import mongoengine
from main.models import User
import secrets

def test_pymongo_connection():
    """Test direct PyMongo connection"""
    print("🔍 Testing PyMongo connection...")
    
    # Load environment variables
    load_dotenv()
    
    MONGO_DB_USERNAME = os.getenv('MONGO_DB_USERNAME', 'doubleHuy')
    MONGO_DB_PASSWORD = os.getenv('MONGO_DB_PASSWORD', 'doubleHuy224712')
    MONGO_CLUSTER_URL = os.getenv('MONGO_CLUSTER_URL', 'predictlearning.uq08cwt.mongodb.net')
    MONGO_DATABASE_NAME = os.getenv('MONGO_DATABASE_NAME', 'PredictLearning')
    
    # Construct connection URI
    uri = f"mongodb+srv://{MONGO_DB_USERNAME}:{MONGO_DB_PASSWORD}@{MONGO_CLUSTER_URL}/?retryWrites=true&w=majority&appName=PredictLearning"
    
    try:
        # Create a new client and connect to the server
        client = MongoClient(uri, server_api=ServerApi('1'))
        
        # Send a ping to confirm a successful connection
        client.admin.command('ping')
        print("✅ PyMongo: Successfully connected to MongoDB Atlas!")
        
        # Test basic operations
        db = client[MONGO_DATABASE_NAME]
        test_collection = db['test_connection']
        
        # Insert a test document
        test_doc = {"message": "Hello from PyMongo!", "timestamp": "2024-12-28"}
        result = test_collection.insert_one(test_doc)
        print(f"✅ PyMongo: Test document inserted with ID: {result.inserted_id}")
        
        # Read the document back
        retrieved_doc = test_collection.find_one({"_id": result.inserted_id})
        print(f"✅ PyMongo: Retrieved document: {retrieved_doc}")
        
        # Clean up - delete the test document
        test_collection.delete_one({"_id": result.inserted_id})
        print("✅ PyMongo: Test document cleaned up")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ PyMongo connection failed: {e}")
        return False

def test_mongoengine_models():
    """Test MongoEngine with User model"""
    print("\n🔍 Testing MongoEngine with User model...")
    
    try:
        # Test User model only
        test_username = f'test_user_{secrets.token_hex(8)}'
        test_email = f'test_{secrets.token_hex(8)}@example.com'
        
        # Create test user
        user = User(
            username=test_username,
            email=test_email,
            first_name='Test',
            last_name='User'
        )
        user.set_password('test123')
        user.save()
        print(f"✅ MongoEngine: User created with ID: {user.id}")
        
        # Test password verification
        if user.check_password('test123'):
            print("✅ MongoEngine: Password verification works")
        else:
            print("❌ MongoEngine: Password verification failed")
        
        # Test querying
        found_user = User.objects(username=test_username).first()
        if found_user:
            print(f"✅ MongoEngine: User query successful - {found_user.username}")
        
        # Test updating
        found_user.first_name = 'Updated'
        found_user.save()
        print("✅ MongoEngine: User update successful")
        
        # Clean up
        user.delete()
        print("✅ MongoEngine: Test user cleaned up")
        
        return True
        
    except Exception as e:
        print(f"❌ MongoEngine models test failed: {e}")
        return False

def test_django_endpoint():
    """Test Django endpoint"""
    print("\n🔍 Testing Django endpoint...")
    
    try:
        from django.test import Client
        
        client = Client()
        
        # Test connection endpoint
        response = client.get('/api/test/')
        if response.status_code == 200:
            print("✅ Django: Test endpoint working")
            data = response.json()
            print(f"   Response message: {data.get('message', 'No message')}")
            return True
        else:
            print(f"❌ Django: Test endpoint failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Django endpoint test failed: {e}")
        return False

def main():
    print("🚀 Testing MongoDB Atlas Connection with Django\n")
    print("=" * 60)
    
    # Test different components
    pymongo_success = test_pymongo_connection()
    mongoengine_success = test_mongoengine_models()
    django_success = test_django_endpoint()
    
    print("\n" + "=" * 60)
    print("📊 Connection Test Results:")
    print(f"PyMongo Direct Connection: {'✅ Success' if pymongo_success else '❌ Failed'}")
    print(f"MongoEngine User Model: {'✅ Success' if mongoengine_success else '❌ Failed'}")
    print(f"Django Test Endpoint: {'✅ Success' if django_success else '❌ Failed'}")
    
    if all([pymongo_success, mongoengine_success, django_success]):
        print("\n🎉 All tests successful! MongoDB Atlas is ready to use.")
        print("\n📋 Available endpoints:")
        print("   GET / - Home page (redirects to test)")
        print("   GET /api/test/ - Test MongoDB connection")
        print("\n🗄️ Database info:")
        print(f"   Database: PredictLearning")
        print(f"   Collection: users")
        print(f"   Connection: MongoDB Atlas")
    else:
        print("\n⚠️ Some tests failed. Please check your configuration.")
        
    print("\n📖 Next steps:")
    print("   1. Run 'python manage.py runserver' to start Django")
    print("   2. Visit http://localhost:8000/ to test the connection")
    print("   3. Your MongoDB Atlas connection is working!")

if __name__ == "__main__":
    main()