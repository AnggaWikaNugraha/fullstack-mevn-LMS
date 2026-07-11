import { ref } from 'vue';
import { checkEnrollment } from '@/api/enrollments';
import { verifyPayment } from '@/api/checkout';

export function useEnrollment(courseId: string) {
  const isPolling = ref(false);
  const isTimedOut = ref(false);
  const isVerifying = ref(false);

  // Poll DB setiap 2 detik — enrollment dibuat oleh webhook Midtrans
  // Kalau 30 detik tidak dapat isEnrolled, panggil onTimeout
  function startPolling(onEnrolled: () => void, onTimeout?: () => void) {
    isPolling.value = true;
    isTimedOut.value = false;
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const result = await checkEnrollment(courseId).then((r) => r.data.data);
        if (result?.isEnrolled) {
          clearInterval(interval);
          isPolling.value = false;
          onEnrolled();
        } else if (attempts >= 15) {
          clearInterval(interval);
          isPolling.value = false;
          isTimedOut.value = true;
          onTimeout?.();
        }
      } catch {
        if (attempts >= 15) {
          clearInterval(interval);
          isPolling.value = false;
          isTimedOut.value = true;
          onTimeout?.();
        }
      }
    }, 2000);
  }

  // Fallback manual — panggil verify endpoint langsung ke Midtrans API
  async function manualVerify(orderId: string, onEnrolled: () => void) {
    isVerifying.value = true;
    try {
      const result = await verifyPayment(orderId).then((r) => r.data.data!);
      if (result.isEnrolled) {
        isTimedOut.value = false;
        onEnrolled();
      }
    } finally {
      isVerifying.value = false;
    }
  }

  return { isPolling, isTimedOut, isVerifying, startPolling, manualVerify };
}
