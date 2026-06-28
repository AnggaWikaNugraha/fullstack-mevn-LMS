import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/vue-query';
import { register } from '@/api/auth';

export function useRegister() {
  const router = useRouter();
  const showPassword = ref(false);
  const showConfirm = ref(false);

  const schema = toTypedSchema(
    z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string(),
    }).refine((d) => d.password === d.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })
  );

  const { handleSubmit, errors } = useForm({ validationSchema: schema });
  const { value: name } = useField<string>('name');
  const { value: email } = useField<string>('email');
  const { value: password } = useField<string>('password');
  const { value: confirmPassword } = useField<string>('confirmPassword');

  const { mutate, isPending, error } = useMutation({
    mutationFn: (values: { name: string; email: string; password: string; confirmPassword: string }) => register(values),
    onSuccess: (_, values) => {
      router.push({ name: 'verify-otp', state: { email: values.email, mode: 'register' } });
    },
  });

  const serverError = computed(() =>
    (error.value as any)?.response?.data?.message || ''
  );

  const onSubmit = handleSubmit((values) => mutate(values));

  return { name, email, password, confirmPassword, errors, isPending, serverError, showPassword, showConfirm, onSubmit };
}
