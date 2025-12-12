"""
Migration Script: Chuyển đổi class_name (String) → class_ref (ReferenceField)

Chạy script này 1 lần để migrate dữ liệu cũ:
    python migrate_class_ref.py
"""

import os
import sys
import django

# Setup Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Predict_Learning_Web.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Initialize Django
django.setup()

from main.models import User, Class


def migrate_class_name_to_class_ref():
    """
    Migration steps:
    1. Lấy tất cả users có class_name nhưng chưa có class_ref
    2. Với mỗi class_name, tìm hoặc tạo Class document
    3. Gán class_ref cho user
    """
    
    print("=" * 60)
    print("🚀 Bắt đầu migration: class_name → class_ref")
    print("=" * 60)
    
    # Lấy tất cả users có class_name nhưng chưa có class_ref
    users_to_migrate = User.objects(
        class_name__exists=True,
        class_name__nin=[None, ""],
        class_ref=None
    )
    
    total = users_to_migrate.count()
    print(f"📊 Tìm thấy {total} users cần migrate")
    
    if total == 0:
        print("✅ Không có users nào cần migrate!")
        return
    
    migrated = 0
    errors = 0
    classes_created = 0
    
    for user in users_to_migrate:
        try:
            class_name = user.class_name.strip()
            if not class_name:
                continue
            
            # Tìm hoặc tạo Class document
            class_obj = Class.objects(name=class_name).first()
            
            if not class_obj:
                # Tạo Class mới
                class_obj = Class(name=class_name)
                class_obj.save()
                classes_created += 1
                print(f"  ➕ Tạo class mới: '{class_name}'")
            
            # Gán class_ref cho user
            user.class_ref = class_obj
            user.save()
            migrated += 1
            
            print(f"  ✓ Migrated: {user.username} → {class_name}")
            
        except Exception as e:
            errors += 1
            print(f"  ❌ Lỗi với user {user.username}: {str(e)}")
    
    print("=" * 60)
    print("📋 KẾT QUẢ MIGRATION:")
    print(f"   ✅ Users migrated: {migrated}/{total}")
    print(f"   ➕ Classes tạo mới: {classes_created}")
    print(f"   ❌ Lỗi: {errors}")
    print("=" * 60)
    
    if errors == 0:
        print("🎉 Migration hoàn thành thành công!")
    else:
        print("⚠️ Migration hoàn thành với một số lỗi. Vui lòng kiểm tra lại.")


def show_current_status():
    """Hiển thị trạng thái hiện tại của data"""
    
    print("\n📊 TRẠNG THÁI HIỆN TẠI:")
    print("-" * 40)
    
    total_users = User.objects.count()
    users_with_class_name = User.objects(class_name__exists=True, class_name__nin=[None, ""]).count()
    users_with_class_ref = User.objects(class_ref__ne=None).count()
    users_need_migrate = User.objects(class_name__exists=True, class_name__nin=[None, ""], class_ref=None).count()
    
    total_classes = Class.objects.count()
    
    print(f"   Tổng users: {total_users}")
    print(f"   Users có class_name: {users_with_class_name}")
    print(f"   Users có class_ref: {users_with_class_ref}")
    print(f"   Users cần migrate: {users_need_migrate}")
    print(f"   Tổng số classes: {total_classes}")
    print("-" * 40)


if __name__ == "__main__":
    show_current_status()
    
    # Xác nhận trước khi migrate
    print("\n⚠️ Bạn có muốn thực hiện migration không? (y/n): ", end="")
    confirm = input().strip().lower()
    
    if confirm == 'y':
        migrate_class_name_to_class_ref()
        print("\n")
        show_current_status()
    else:
        print("❌ Migration đã bị hủy.")
