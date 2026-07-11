import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { useAuthStore } from '@/stores/authStore';
import { getBootcampDetail } from '@/api/bootcamps';
import type { BootcampBatch } from '@/types/bootcamps';

export function useBootcampDetail(id: string) {
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();

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

  // Format tanggal sesi ke "Sabtu, 14 Jan 2025"
  function formatSessionDate(dateStr: string) {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr));
  }

  // Tombol daftar — cek login, redirect jika belum
  function handleRegister() {
    if (!authStore.user) {
      localStorage.setItem('redirect_after_login', route.fullPath);
      router.push('/auth/login');
      return;
    }
    // Phase 4: buka modal checkout
  }

  const isRegisterDisabled = (status: string, quota: number) =>
    status !== 'open' || quota >= 100;

  return {
    bootcamp,
    batches,
    selectedBatch,
    selectedSessions,
    selectedBatchIndex,
    setSelectedBatch,
    formatSessionDate,
    handleRegister,
    isRegisterDisabled,
    isLoading,
    isError,
  };
}
