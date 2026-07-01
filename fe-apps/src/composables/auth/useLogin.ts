import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/vue-query';
import { login } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { useDeviceId } from '@/composables/useDeviceId';

export function useLogin() {
  const router = useRouter();
  const auth = useAuthStore();
  const { getDeviceId } = useDeviceId();
  const showPassword = ref(false);

  const schema = toTypedSchema(
    z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(1, 'Password is required'),
    })
  );

  const { handleSubmit, errors } = useForm({ validationSchema: schema });
  const { value: email } = useField<string>('email');
  const { value: password } = useField<string>('password');

  const { mutate, isPending, error } = useMutation({
    mutationFn: (values: { email: string; password: string }) => login({ ...values, deviceId: getDeviceId() }),
    onSuccess: ({ data }) => {
      auth.setAuth(data.data!.user, data.data!.accessToken, data.data!.refreshToken);
      router.push('/');
    },
  });

  const serverError = computed(() =>
    (error.value as any)?.response?.data?.message || ''
  );

  // True when BE returns 403 GOOGLE_ONLY_ACCOUNT — show guided error with Forgot Password link
  const isGoogleOnlyAccount = computed(() =>
    (error.value as any)?.response?.data?.code === 'GOOGLE_ONLY_ACCOUNT'
  );

  const onSubmit = handleSubmit((values) => mutate(values));

  return { email, password, errors, isPending, serverError, isGoogleOnlyAccount, showPassword, onSubmit };
}
