import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getMyOrders } from '@/api/orders';

export function useOrders() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => getMyOrders().then((r) => r.data.data),
  });

  const orders = computed(() => data.value?.orders ?? []);

  return {
    orders,
    isLoading,
    isError,
  };
}
