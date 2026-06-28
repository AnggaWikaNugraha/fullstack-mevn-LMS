import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useErrorStore } from '@/stores/errorStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token and deviceId to every outgoing request
apiClient.interceptors.request.use((config) => {
  const auth = useAuthStore();
  const deviceId = localStorage.getItem('deviceId');

  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  if (deviceId) {
    config.headers['x-device-id'] = deviceId;
  }
  return config;
});

// Handle responses globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const auth = useAuthStore();
    const errorStore = useErrorStore();
    const originalRequest = error.config;

    // --- 401: Try silent refresh once ---
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      const deviceId = localStorage.getItem('deviceId');

      if (refreshToken && deviceId) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
            { refreshToken, deviceId }
          );
          const newAccessToken = data.data.accessToken;
          auth.setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest); // retry original request
        } catch {
          // Refresh token also failed — force logout
          auth.logout();
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }
      } else {
        auth.logout();
        window.location.href = '/auth/login';
      }
    }

    // --- Network error or 5xx: show global error modal ---
    if (!error.response || error.response.status >= 500) {
      errorStore.show(
        !error.response
          ? 'No internet connection. Please check your network.'
          : 'Server error. Please try again later.'
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
