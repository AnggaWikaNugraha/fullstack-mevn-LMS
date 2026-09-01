import { useMutation } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { createOrder } from '@/api/checkout';
import { loadSnapScript } from '@/utils/snap';

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
