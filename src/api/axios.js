import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://workintech-fe-ecommerce.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - "Bearer " öneki olmadan token'ı deneyelim
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Önce "Bearer " öneki olmadan deneyelim
      config.headers.Authorization = token;
      console.log('Token eklendi (öneksiz):', token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Token'ı response header'dan al
    const token = response.headers.authorization;
    if (token) {
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.common['Authorization'] = token;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('401 Unauthorized hatası - token geçersiz olabilir');
      // Kullanıcıyı login sayfasına yönlendirebiliriz
      // window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 