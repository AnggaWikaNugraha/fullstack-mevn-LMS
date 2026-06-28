import { ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import { verifyOtp, resendOtp, verifyResetOtp } from '@/api/auth';

export function useOtpVerification() {
  const router = useRouter();

  // Email and mode are passed via router state from the previous page
  const email = (history.state?.email as string) || '';
  const mode = (history.state?.mode as 'register' | 'reset') || 'register';

  if (!email) router.replace('/auth/login');

  const otp = ref('');
  const cooldown = ref(60);

  const timer = setInterval(() => {
    if (cooldown.value > 0) cooldown.value--;
  }, 1000);

  onUnmounted(() => clearInterval(timer));

  const canResend = computed(() => cooldown.value === 0);

  // Mutation for OTP verification — calls different endpoint based on mode
  const { mutate: submitOtp, isPending, error: submitError } = useMutation({
    mutationFn: (otpValue: string) => mode === 'register' ? verifyOtp({ email, otp: otpValue }) : verifyResetOtp({ email, otp: otpValue }),
    onSuccess: () => {
      if (mode === 'register') {
        router.push('/auth/login');
      } else {
        router.push({ name: 'reset-password', state: { email, otp: otp.value } });
      }
    },
  });

  // Separate mutation for resend — resets the countdown on success
  const { mutate: resendMutate, isPending: isResending, error: resendError } = useMutation({
    mutationFn: () => resendOtp({ email }),
    onSuccess: () => {
      cooldown.value = 60;
    },
  });

  // Show whichever error is active (submit or resend)
  const serverError = computed(() =>
    (submitError.value as any)?.response?.data?.message ||
    (resendError.value as any)?.response?.data?.message ||
    ''
  );

  const onSubmit = () => {
    if (otp.value.length === 6) submitOtp(otp.value);
  };

  const onResend = () => {
    if (canResend.value) resendMutate();
  };

  return { email, otp, isPending, isResending, serverError, cooldown, canResend, onSubmit, onResend };
}
