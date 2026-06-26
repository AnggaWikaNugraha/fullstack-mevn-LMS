import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
}

export const useAuthStore = defineStore('auth', () => {
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
