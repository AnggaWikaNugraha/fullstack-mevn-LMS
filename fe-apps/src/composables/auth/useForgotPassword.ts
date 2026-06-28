import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/vue-query';
import { forgotPassword } from '@/api/auth';

export function useForgotPassword() {
  const router = useRouter();

  const schema = toTypedSchema(
    z.object({ email: z.string().email('Invalid email address') })
  );

  const { handleSubmit, errors } = useForm({ validationSchema: schema });
  const { value: email } = useField<string>('email');

  const { mutate, isPending, error } = useMutation({
    mutationFn: (values: { email: string }) => forgotPassword(values),
    // Always navigate to OTP page — BE returns 200 even if email not found (prevents enumeration)
    onSuccess: (_, values) => {
      router.push({ name: 'verify-otp', state: { email: values.email, mode: 'reset' } });
    },
  });

  const serverError = computed(() =>
    (error.value as any)?.response?.data?.message || ''
  );

  const onSubmit = handleSubmit((values) => mutate(values));

  return { email, errors, isPending, serverError, onSubmit };
}
