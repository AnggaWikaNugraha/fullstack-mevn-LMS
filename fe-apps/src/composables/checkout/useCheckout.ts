import { useMutation } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { createOrder } from '@/api/checkout';

// Load Midtrans snap.js satu kali ke <head>
function loadSnapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById('midtrans-snap')) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = 'midtrans-snap';
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY ?? '');
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Gagal memuat Midtrans Snap'));
    document.head.appendChild(script);
  });
}

export function useCheckout(courseId: string) {
  const router = useRouter();

  const { mutate: startCheckout, isPending } = useMutation({
    mutationFn: async () => {
      await loadSnapScript();
      const res = await createOrder(courseId);
      return res.data.data!;
    },
    onSuccess: ({ snap_token, order_id }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).snap.pay(snap_token, {
        onSuccess: () => {
          router.push(`/checkout/result?order_id=${order_id}&course_id=${courseId}&result=success`);
        },
        onPending: () => {
          router.push(`/checkout/result?order_id=${order_id}&course_id=${courseId}&result=pending`);
        },
        onError: () => {
          router.push(`/checkout/result?order_id=${order_id}&course_id=${courseId}&result=error`);
        },
        onClose: () => {
          // User tutup popup tanpa bayar — tidak redirect
        },
      });
    },
  });

  return { startCheckout, isPending };
}
