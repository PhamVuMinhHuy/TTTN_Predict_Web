# Sử dụng base image Python chính thức
FROM python:3.11-slim

# Thiết lập biến môi trường
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Tạo thư mục làm việc
WORKDIR /app

# Copy file requirements và cài đặt dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy toàn bộ code của backend vào image
COPY . .

# Tạo thư mục staticfiles và collect static files
RUN mkdir -p /app/staticfiles
RUN python manage.py collectstatic --noinput --clear

# Expose port
EXPOSE 8000

# Run gunicorn (command này sẽ bị override bởi docker-compose)
CMD ["gunicorn", "Predict_Learning_Web.wsgi:application", "--bind", "0.0.0.0:8000"]