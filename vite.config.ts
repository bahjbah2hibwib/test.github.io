import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Không cần loadEnv ở đây nữa vì Vite tự động làm việc này
export default defineConfig({
  // Vấn đề 1: Thêm 'base' để sửa lỗi 404 trên GitHub Pages
  //  NHỚ THAY 'test.github.io' BẰNG TÊN REPOSITORY CỦA BẠN !!!
  // base: '/test.github.io/',

  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
  // Vấn đề 2: Bỏ hoàn toàn khối 'define' đi. Vite sẽ tự xử lý các biến có tiền tố VITE_
});