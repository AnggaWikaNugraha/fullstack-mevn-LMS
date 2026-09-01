import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { useAuthStore } from '@/stores/authStore';
import { getBootcampDetail } from '@/api/bootcamps';
import { useBootcampCheckout } from './useBootcampCheckout';
import type { BootcampBatch } from '@/types/bootcamps';

export function useBootcampDetail(id: string) {
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  const { startCheckout, isPending: isCheckoutPending } = useBootcampCheckout(id);

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

  // Tombol daftar — cek login dulu, lalu buka popup pembayaran Midtrans
  function handleRegister() {
    if (!authStore.user) {
      localStorage.setItem('redirect_after_login', route.fullPath);
      router.push('/auth/login');
      return;
    }
    if (!selectedBatch.value || ctaState.value.disabled) return;
    startCheckout(selectedBatch.value._id);
  }

  // Satu sumber kebenaran untuk label dan keadaan tombol, diurutkan dari
  // kondisi yang paling spesifik ke yang paling umum
  const ctaState = computed<{ label: string; disabled: boolean }>(() => {
    if (!selectedBatch.value) return { label: 'Belum Ada Batch', disabled: true };
    if (selectedBatch.value.isEnrolled) return { label: 'Sudah Terdaftar', disabled: true };
    if (isCheckoutPending.value) return { label: 'Memproses...', disabled: true };
    if (bootcamp.value?.status === 'coming_soon') return { label: 'Segera Hadir', disabled: true };
    if (bootcamp.value?.status === 'closed') return { label: 'Pendaftaran Ditutup', disabled: true };
    if (selectedBatch.value.quota_used_percentage >= 100) return { label: 'Kuota Penuh', disabled: true };
    return { label: 'Daftar Sekarang', disabled: false };
  });

  return {
    bootcamp,
    batches,
    selectedBatch,
    selectedSessions,
    selectedBatchIndex,
    setSelectedBatch,
    formatSessionDate,
    handleRegister,
    ctaState,
    isLoading,
    isError,
  };
}
