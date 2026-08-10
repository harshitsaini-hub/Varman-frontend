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

// Interceptor to handle 401 Unauthorized: clear stale token without breaking public pages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('varman_token');
      // Note: Do NOT force window.location.href = '/login' here,
      // as it breaks public routes like the Landing Page ('/').
      // ProtectedRoute handles redirecting to '/login' for protected routes.
    }
    return Promise.reject(error);
  }
);

export default api;
