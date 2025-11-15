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

def test_pymongo_connection():
    """Test direct PyMongo connection"""
    print("🔍 Testing PyMongo connection...")
    
    # Load environment variables
    load_dotenv()
    
    MONGO_DB_USERNAME = os.getenv('MONGO_DB_USERNAME', 'doubleHuy')
    MONGO_DB_PASSWORD = os.getenv('MONGO_DB_PASSWORD', 'doubleHuy224712')
    MONGO_CLUSTER_URL = os.getenv('MONGO_CLUSTER_URL', 'predictlearning.uq08cwt.mongodb.net')
    
    # Construct connection URI
    uri = f"mongodb+srv://{MONGO_DB_USERNAME}:{MONGO_DB_PASSWORD}@{MONGO_CLUSTER_URL}/?retryWrites=true&w=majority&appName=PredictLearning"
    
    try:
        # Create a new client and connect to the server
        client = MongoClient(uri, server_api=ServerApi('1'))
        
        # Send a ping to confirm a successful connection
        client.admin.command('ping')
        print("✅ PyMongo: Successfully connected to MongoDB Atlas!")
        
        # Test basic operations
        db = client['PredictLearning']
        test_collection = db['test_connection']
        
        # Insert a test document
        test_doc = {"message": "Hello from PyMongo!", "timestamp": "2024-01-01"}
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

def test_mongoengine_connection():
    """Test MongoEngine connection through Django settings"""
    print("\n🔍 Testing MongoEngine connection...")
    
    try:
        # Test the connection that was established in settings.py
        from mongoengine import Document, fields
        
        # Define a simple test document
        class TestDocument(Document):
            message = fields.StringField(required=True)
            timestamp = fields.StringField()
            
            meta = {
                'collection': 'test_mongoengine'
            }
        
        # Test insert
        test_doc = TestDocument(message="Hello from MongoEngine!", timestamp="2024-01-01")
        test_doc.save()
        print(f"✅ MongoEngine: Test document saved with ID: {test_doc.id}")
        
        # Test retrieve
        retrieved_doc = TestDocument.objects(id=test_doc.id).first()
        print(f"✅ MongoEngine: Retrieved document: {retrieved_doc.message}")
        
        # Test delete
        retrieved_doc.delete()
        print("✅ MongoEngine: Test document cleaned up")
        
        return True
        
    except Exception as e:
        print(f"❌ MongoEngine connection failed: {e}")
        return False

def main():
    print("🚀 Testing MongoDB Atlas Connection\n")
    print("=" * 50)
    
    # Test both connection methods
    pymongo_success = test_pymongo_connection()
    mongoengine_success = test_mongoengine_connection()
    
    print("\n" + "=" * 50)
    print("📊 Connection Test Results:")
    print(f"PyMongo: {'✅ Success' if pymongo_success else '❌ Failed'}")
    print(f"MongoEngine: {'✅ Success' if mongoengine_success else '❌ Failed'}")
    
    if pymongo_success and mongoengine_success:
        print("\n🎉 All connections successful! MongoDB Atlas is ready to use.")
    else:
        print("\n⚠️ Some connections failed. Please check your configuration.")

if __name__ == "__main__":
    main()