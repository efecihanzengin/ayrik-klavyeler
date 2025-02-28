import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://workintech-fe-ecommerce.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - her istekte token'ı ekle
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

// Response interceptor - hata durumlarını handle et
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz veya expire olmuş
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 