import { useMutation } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { createBootcampOrder } from '@/api/bootcamps';
import { loadSnapScript } from '@/utils/snap';

// Checkout satu batch bootcamp. Alurnya sama persis dengan checkout course,
// bedanya hanya endpoint create-order dan halaman hasil yang dituju.
export function useBootcampCheckout(packageId: string) {
  const router = useRouter();

  const { mutate: startCheckout, isPending } = useMutation({
    mutationFn: async (batchId: string) => {
      await loadSnapScript();
      const res = await createBootcampOrder(batchId);
      return { ...res.data.data!, batchId };
    },
    onSuccess: ({ snap_token, order_id, batchId }) => {
      const base = `/checkout/bootcamp/result?order_id=${order_id}&batch_id=${batchId}&package_id=${packageId}`;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).snap.pay(snap_token, {
        onSuccess: () => {
          router.push(`${base}&result=success`);
        },
        onPending: () => {
          router.push(`${base}&result=pending`);
        },
        onError: () => {
          router.push(`${base}&result=error`);
        },
        onClose: () => {
          // User tutup popup tanpa bayar — tidak redirect
        },
      });
    },
  });

  return { startCheckout, isPending };
}
