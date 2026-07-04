import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getBootcampDetail } from '@/api/bootcamps';
import type { BootcampBatch } from '@/types/bootcamps';

export function useBootcampDetail(id: string) {
  // Indeks batch yang sedang dipilih — switching dilakukan client-side tanpa refetch
  const selectedBatchIndex = ref(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['bootcamp', id],
    queryFn: () => getBootcampDetail(id),
    staleTime: 5 * 60 * 1000,
  });

  const bootcamp = computed(() => data.value?.data.data?.bootcamp ?? null);
  const batches = computed<BootcampBatch[]>(() => bootcamp.value?.batches ?? []);

  const selectedBatch = computed<BootcampBatch | null>(
    () => batches.value[selectedBatchIndex.value] ?? null
  );

  const selectedSessions = computed(() => selectedBatch.value?.sessions ?? []);

  function setSelectedBatch(index: number) {
    selectedBatchIndex.value = index;
  }

  // Format harga ke Rupiah
  function formatRupiah(price: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  }

  // Format tanggal sesi ke "Sabtu, 14 Jan 2025"
  function formatSessionDate(dateStr: string) {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr));
  }

  return {
    bootcamp,
    batches,
    selectedBatch,
    selectedSessions,
    selectedBatchIndex,
    setSelectedBatch,
    formatRupiah,
    formatSessionDate,
    isLoading,
    isError,
  };
}
