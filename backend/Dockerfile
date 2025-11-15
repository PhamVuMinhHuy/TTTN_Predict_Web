# Sử dụng base image Python chính thức
FROM python:3.11-slim

# Thiết lập biến môi trường
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Tạo thư mục làm việc
WORKDIR /app

# Cài đặt các thư viện hệ thống cần thiết (nếu có)
# Ví dụ: nếu thư viện AI của bạn cần gcc hoặc các thư viện khác
# RUN apt-get update && apt-get install -y --no-install-recommends gcc

# Copy file requirements và cài đặt dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy toàn bộ code của backend vào image
COPY . .

# Django cần Gunicorn để chạy trong môi trường production
# Thêm gunicorn vào file requirements.txt của bạn!
# CMD ["gunicorn", "your_django_project.wsgi:application", "--bind", "0.0.0.0:8000"]