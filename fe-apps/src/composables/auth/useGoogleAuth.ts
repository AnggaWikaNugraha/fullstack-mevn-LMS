import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import { googleLogin } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { useDeviceId } from '@/composables/useDeviceId';

export function useGoogleAuth() {
  const router = useRouter();
  const auth = useAuthStore();
  const { getDeviceId } = useDeviceId();

  const { mutate: submitCode, isPending, error } = useMutation({
    mutationFn: (code: string) => googleLogin({ code, deviceId: getDeviceId() }),
    onSuccess: ({ data }) => {
      auth.setAuth(data.data!.user, data.data!.accessToken, data.data!.refreshToken);
      router.push('/');
    },
  });

  const serverError = computed(() =>
    (error.value as any)?.response?.data?.message || ''
  );

  // Redirect the browser to Google's OAuth consent page.
  // Google will redirect back to GOOGLE_REDIRECT_URI with ?code=xxx after user selects account.
  function redirectToGoogle() {
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
      redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI as string,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account',
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // Called by GoogleCallbackView after extracting the code from the URL
  function handleCallback(code: string) {
    submitCode(code);
  }

  return { isPending, serverError, redirectToGoogle, handleCallback };
}
