import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getMyBootcampEnrollments } from '@/api/bootcamps';
import type { MyBootcampEnrollment } from '@/types/bootcamps';

export function useMyBootcamps() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-bootcamps'],
    queryFn: () => getMyBootcampEnrollments().then((r) => r.data.data),
  });

  const bootcamps = computed(() => data.value?.bootcamps ?? []);

  // Yang sedang berjalan dan akan datang ditaruh di atas, yang selesai di bawah
  const active = computed(() => bootcamps.value.filter((b) => b.status !== 'finished'));
  const finished = computed(() => bootcamps.value.filter((b) => b.status === 'finished'));

  return { bootcamps, active, finished, isLoading, isError };
}

export const bootcampStatusBadge: Record<MyBootcampEnrollment['status'], string> = {
  upcoming: 'bg-amber-50 text-amber-600',
  ongoing:  'bg-emerald-50 text-emerald-700',
  finished: 'bg-gray-100 text-gray-500',
};

export const bootcampStatusLabel: Record<MyBootcampEnrollment['status'], string> = {
  upcoming: 'Akan Dimulai',
  ongoing:  'Sedang Berjalan',
  finished: 'Selesai',
};

export const packageTypeLabel: Record<string, string> = {
  online: 'Online',
  offline: 'Offline',
  hybrid: 'Hybrid',
};

export function formatSessionDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
