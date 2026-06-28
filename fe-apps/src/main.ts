import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import './style.css';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/authStore';
import { refreshAccessToken, getMe } from './api/auth';

async function initApp() {
  const app = createApp(App);
  const pinia = createPinia();
  app.use(pinia);

  const auth = useAuthStore();
  auth.loadFromStorage();

  const storedRefreshToken = localStorage.getItem('refreshToken');
  const storedDeviceId = localStorage.getItem('deviceId');

  if (storedRefreshToken && storedDeviceId) {
    try {
      // Step 1: refresh first to get a valid access token
      const { data: refreshData } = await refreshAccessToken(storedRefreshToken, storedDeviceId);
      auth.setAccessToken(refreshData.data!.accessToken);

      // Step 2: getMe with valid access token — no 401, no retry needed
      const { data: meData } = await getMe();
      if (meData.data?.user) auth.setUser(meData.data.user);
    } catch {
      // Refresh token expired or invalid — clear stale session
      auth.logout();
    }
  }

  app.use(router).use(VueQueryPlugin).mount('#app');
}

initApp();
