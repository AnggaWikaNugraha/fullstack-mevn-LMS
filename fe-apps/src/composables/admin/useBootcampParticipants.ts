import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { adminListBootcampParticipants, type AdminBootcampParticipant } from '@/api/admin/bootcamps';

export function useBootcampParticipants(packageId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-bootcamp-participants', packageId],
    queryFn: () => adminListBootcampParticipants(packageId).then((r) => r.data.data!),
  });

  const participants = computed(() => data.value?.participants ?? []);
  const total = computed(() => data.value?.total ?? 0);

  // Jumlah peserta per batch — dipakai untuk badge di header kartu batch
  const countByBatch = computed(() => {
    const map: Record<string, number> = {};
    for (const p of participants.value) {
      if (p.batchId) map[p.batchId._id] = (map[p.batchId._id] ?? 0) + 1;
    }
    return map;
  });

  // Filter batch: null = semua batch
  const batchFilter = ref<string | null>(null);

  const filtered = computed(() =>
    batchFilter.value
      ? participants.value.filter((p) => p.batchId?._id === batchFilter.value)
      : participants.value,
  );

  // Daftar batch yang benar-benar punya peserta, untuk pill filter
  const batchesWithParticipants = computed(() => {
    const seen = new Map<string, { _id: string; title: string; count: number }>();
    for (const p of participants.value) {
      if (!p.batchId) continue;
      const found = seen.get(p.batchId._id);
      if (found) found.count += 1;
      else seen.set(p.batchId._id, { _id: p.batchId._id, title: p.batchId.title, count: 1 });
    }
    return [...seen.values()];
  });

  return {
    participants, filtered, total, isLoading,
    countByBatch, batchFilter, batchesWithParticipants,
  };
}

export const orderStatusBadge: Record<string, string> = {
  paid:    'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-600',
  failed:  'bg-red-50 text-red-600',
  expired: 'bg-gray-100 text-gray-500',
};

export function formatParticipantDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function participantInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

export type { AdminBootcampParticipant };
