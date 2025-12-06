# 📧 Hướng dẫn cấu hình Email cho chức năng Quên Mật Khẩu

## Bước 1: Tạo Gmail App Password

1. **Truy cập:** https://myaccount.google.com/apppasswords
2. **Đăng nhập** bằng tài khoản Gmail của bạn
3. **Tạo App Password:**
   - Chọn app: "Mail"
   - Chọn device: "Other" → Nhập tên (ví dụ: "Predict Learning")
   - Click "Generate"
4. **Copy mã 16 ký tự** được tạo ra (dạng: `abcd efgh ijkl mnop`)

> **Lưu ý:** Bạn cần bật 2-Step Verification trước khi tạo App Password

## Bước 2: Cập nhật file .env

Mở file `backend/.env` và cập nhật:

```env
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=abcd efgh ijkl mnop
```

**Ví dụ:**
```env
EMAIL_HOST_USER=myschool@gmail.com
EMAIL_HOST_PASSWORD=abcd efgh ijkl mnop
```

## Bước 3: Restart Backend Server

Sau khi cập nhật `.env`, restart Django server:

```bash
cd backend
python manage.py runserver
```

## Test chức năng

1. Truy cập: http://localhost:5174 (hoặc port frontend của bạn)
2. Click "Quên mật khẩu?" ở trang login
3. Nhập email đã đăng ký
4. Kiểm tra email → Nhận mã OTP
5. Nhập OTP và đặt mật khẩu mới

## Troubleshooting

### Lỗi: "SMTPAuthenticationError"
- Kiểm tra lại EMAIL_HOST_USER và EMAIL_HOST_PASSWORD
- Đảm bảo đã bật 2-Step Verification
- Tạo lại App Password mới

### Lỗi: "SMTPServerDisconnected"
- Kiểm tra kết nối internet
- Gmail có thể block nếu gửi quá nhiều email trong thời gian ngắn

### Test mà không cần email thật

Nếu muốn test mà không gửi email thật, mở `settings.py` và uncomment dòng này:

```python
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

Email sẽ được in ra console thay vì gửi thật.

## Bảo mật

⚠️ **QUAN TRỌNG:**
- Không commit file `.env` lên Git
- File `.env` đã được thêm vào `.gitignore`
- Không chia sẻ App Password với ai
- Nếu lộ App Password, xóa và tạo mới ngay

## Đã hoàn thành ✅

- ✅ Thêm email config vào `settings.py`
- ✅ Tạo file `.env` mẫu
- ✅ Hướng dẫn tạo Gmail App Password
- ✅ Hướng dẫn test và troubleshooting

Bây giờ bạn chỉ cần:
1. Tạo Gmail App Password
2. Cập nhật vào file `.env`
3. Restart server
4. Test thử!
