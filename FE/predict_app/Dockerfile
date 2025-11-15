# GIAI ĐOẠN 1: Build ứng dụng React
# Sử dụng image Node.js phiên bản 18, loại alpine siêu nhẹ
FROM node:18-alpine as builder

# Đặt thư mục làm việc bên trong container là /app
WORKDIR /app

# Copy package.json và package-lock.json vào trước
# -> Tận dụng cache của Docker, nếu 2 file này không đổi thì không cần chạy lại npm install
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ source code còn lại vào
COPY . .

# Lấy biến môi trường từ file docker-compose để biết địa chỉ API
# Vite mặc định dùng biến có tiền tố VITE_
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Chạy lệnh build của Vite để tạo ra các file tĩnh trong thư mục /dist
RUN npm run build

# GIAI ĐOẠN 2: Serve các file tĩnh bằng Nginx
# Sử dụng image Nginx chính thức, loại alpine siêu nhẹ
FROM nginx:stable-alpine

# Copy các file đã được build ở GIAI ĐOẠN 1 từ thư mục /app/dist
# vào thư mục mặc định của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy file cấu hình Nginx tùy chỉnh của chúng ta (sẽ tạo ở bước 2)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở port 80 để Nginx có thể nhận request
EXPOSE 80

# Lệnh để khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]