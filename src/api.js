import axios from 'axios';

let rawBaseUrl = import.meta.env.VITE_API_URL || '/api';
rawBaseUrl = rawBaseUrl.replace(/\/+$/, '');
if (!rawBaseUrl.endsWith('/api')) {
  rawBaseUrl = `${rawBaseUrl}/api`;
}

const api = axios.create({
  // Use normalized environment variable if deployed, otherwise fallback to local proxy
  baseURL: rawBaseUrl,
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
