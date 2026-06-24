import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));

  const isAuthenticated = computed(() => !!token.value);

  function setAuth(userData: User, accessToken: string) {
    user.value = userData;
    token.value = accessToken;
    localStorage.setItem('token', accessToken);
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  return { user, token, isAuthenticated, setAuth, logout };
});
