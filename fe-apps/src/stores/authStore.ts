import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types/auth';

// Auth store — holds access token in memory and persists user/refresh data in localStorage
export const useAuthStore = defineStore('auth', () => {
  // Access token lives only in memory — cleared on page refresh (re-fetched via refresh token)
  const accessToken = ref<string | null>(null);
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!accessToken.value);

  function setAuth(userData: User, access: string, refresh: string) {
    user.value = userData;
    accessToken.value = access;
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  function setAccessToken(token: string) {
    accessToken.value = token;
  }

  function logout() {
    accessToken.value = null;
    user.value = null;
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('deviceId');
  }

  // Called on app mount — restore user from localStorage before token is re-validated
  function loadFromStorage() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) user.value = JSON.parse(storedUser);
  }

  return {
    accessToken,
    user,
    isAuthenticated,
    setAuth,
    setAccessToken,
    logout,
    loadFromStorage,
  };
});
