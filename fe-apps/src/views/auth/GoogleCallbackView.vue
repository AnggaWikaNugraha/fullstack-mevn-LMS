<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Loader2 } from '@lucide/vue';
import { useGoogleAuth } from '@/composables/auth/useGoogleAuth';

const router = useRouter();
const {
  handleCallback,
  serverError,
} = useGoogleAuth();

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const error = params.get('error');

  // User cancelled the Google login screen
  if (error || !code) {
    router.replace('/auth/login');
    return;
  }

  handleCallback(code);
});
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
    <template v-if="!serverError">
      <Loader2 class="w-8 h-8 animate-spin text-indigo-600" />
      <p class="text-sm text-gray-500">Signing you in with Google...</p>
    </template>

    <template v-else>
      <p class="text-sm text-red-600 font-medium">{{ serverError }}</p>
      <RouterLink to="/auth/login" class="text-sm text-indigo-600 hover:underline">
        Back to Login
      </RouterLink>
    </template>
  </div>
</template>
