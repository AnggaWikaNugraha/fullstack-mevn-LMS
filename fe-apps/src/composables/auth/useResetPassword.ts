import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/vue-query';
import { resetPassword } from '@/api/auth';

export function useResetPassword() {
  const router = useRouter();

  // email and otp passed from OtpVerificationView via router state
  const email = (history.state?.email as string) || '';
  const otp = (history.state?.otp as string) || '';

  if (!email || !otp) router.replace('/auth/forgot-password');

  const showPassword = ref(false);
  const showConfirm = ref(false);

  const schema = toTypedSchema(
    z.object({
      newPassword: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string(),
    }).refine((d) => d.newPassword === d.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })
  );

  const { handleSubmit, errors } = useForm({ validationSchema: schema });
  const { value: newPassword } = useField<string>('newPassword');
  const { value: confirmPassword } = useField<string>('confirmPassword');

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: (values: { newPassword: string; confirmPassword: string }) => resetPassword({ email, otp, ...values }),
    onSuccess: () => {
      // Redirect to login after 2 seconds — isSuccess drives the success UI in the template
      setTimeout(() => router.push('/auth/login'), 2000);
    },
  });

  const serverError = computed(() =>
    (error.value as any)?.response?.data?.message || ''
  );

  const onSubmit = handleSubmit((values) => mutate(values));

  return { newPassword, confirmPassword, errors, isPending, isSuccess, serverError, showPassword, showConfirm, onSubmit };
}
