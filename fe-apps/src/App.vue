<script setup lang="ts">
import GlobalErrorModal from '@/components/ui/GlobalErrorModal.vue';
import { useAuthStore } from '@/stores/authStore';
import { onMounted } from 'vue';
import { getMe } from '@/api/auth';

const auth = useAuthStore();

// On app start, restore user from localStorage and validate token with BE
onMounted(async () => {
  auth.loadFromStorage();
  if (localStorage.getItem('refreshToken')) {
    try {
      const { data } = await getMe();
      if (data.data?.user) auth.user = data.data.user;
    } catch {
      // Token invalid or expired — auth store stays empty, router guard handles redirect
    }
  }
});
</script>

<template>
  <RouterView />
  <GlobalErrorModal />
</template>
