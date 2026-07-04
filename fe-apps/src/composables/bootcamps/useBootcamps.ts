import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getBootcamps } from '@/api/bootcamps';

export function useBootcamps() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['bootcamps'],
    queryFn: () => getBootcamps({ limit: 6 }),
    staleTime: 5 * 60 * 1000, // data bootcamp jarang berubah — cache 5 menit
  });

  const bootcamps = computed(() => data.value?.data.data?.bootcamps ?? []);

  return { bootcamps, isLoading, isError };
}
