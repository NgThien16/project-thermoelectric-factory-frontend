import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // Đổi từ /api/v1 thành /api cho khớp với Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để xử lý token nếu cần sau này
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
