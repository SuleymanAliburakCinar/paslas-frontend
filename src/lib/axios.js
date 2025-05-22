import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // örn: Token süresi doldu → logout veya yönlendirme yapılabilir
      console.warn('Yetkisiz erişim. Oturum süresi dolmuş olabilir.');
    }
    return Promise.reject(error);
  }
);

export default api;
