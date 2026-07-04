import axios from 'axios';

const api = axios.create({
  // Use the environment variable if deployed, otherwise fallback to local proxy
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Interceptor to inject JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('varman_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('varman_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
