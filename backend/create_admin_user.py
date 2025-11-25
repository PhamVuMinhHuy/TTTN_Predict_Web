import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Predict_Learning_Web.settings')
django.setup()

from main.models import User


def create_admin(username: str, password: str, email: str | None = None):
    # Check exists
    existing = User.objects(username=username).first()
    if existing:
        print(f"User '{username}' đã tồn tại với role = {existing.role}")
        return

    user = User(
        username=username,
        email=email or None,
        first_name='Admin',
        last_name='User',
        role='admin',  # quan trọng
    )
    user.set_password(password)
    user.save()
    print("✅ Tạo admin thành công:")
    print(f"   ID      : {user.id}")
    print(f"   Username: {user.username}")
    print(f"   Email   : {user.email}")
    print(f"   Role    : {user.role}")


if __name__ == "__main__":
    # Sửa lại thông tin admin bạn muốn
    create_admin(
        username="admin",
        password="Admin@123",
        email="admin@gmail.com",
    )
