import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.5:8080/api',
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

// thêm response interceptor để xử lý token hết hạn
axiosInstance.interceptors.response.use(
    response => response,

    error => {
        if (
            error.response?.status === 401 &&
            window.location.pathname !== "/login"
        ) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
