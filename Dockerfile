# Giai đoạn 1: Build ứng dụng
# Sử dụng một "khuôn mẫu" Node.js phiên bản 18 để làm môi trường build
FROM node:18-alpine AS build

# Đặt thư mục làm việc bên trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json vào trước
COPY package*.json ./

# Cài đặt các thư viện cần thiết
RUN npm install

# Sao chép toàn bộ mã nguồn còn lại vào
COPY . .

# Chạy lệnh build để tạo ra thư mục 'dist'
RUN npm run build

# Giai đoạn 2: Serve ứng dụng đã build
# Sử dụng một "khuôn mẫu" web server Nginx siêu nhẹ
FROM nginx:stable-alpine

# Sao chép thư mục 'dist' từ giai đoạn 'build' vào thư mục mặc định của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Mở cổng 80 để bên ngoài có thể truy cập vào Nginx
EXPOSE 80

# Lệnh để khởi động Nginx khi container chạy
CMD ["nginx", "-g", "daemon off;"]