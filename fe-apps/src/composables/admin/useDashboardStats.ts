import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { adminGetDashboardStats } from '@/api/admin/dashboard';

export function useDashboardStats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: () => adminGetDashboardStats().then((r) => r.data.data!),
  });

  return {
    stats: computed(() => data.value),
    recentOrders: computed(() => data.value?.recentOrders ?? []),
    isLoading,
    isError,
  };
}
