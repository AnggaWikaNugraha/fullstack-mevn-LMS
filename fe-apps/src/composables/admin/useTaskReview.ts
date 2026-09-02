import { ref, computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { adminListSubmissions, adminReviewSubmission } from '@/api/admin/tasks';

export function useTaskReview() {
  const qc = useQueryClient();
  const statusFilter = ref('');
  const page = ref(1);

  const { data, isLoading } = useQuery({
    queryKey: computed(() => ['admin-tasks', statusFilter.value, page.value]),
    queryFn: () => adminListSubmissions({
      status: statusFilter.value || undefined,
      page: page.value,
      limit: 20,
    }).then((r) => r.data.data!),
  });

  const submissions = computed(() => data.value?.submissions ?? []);
  const pagination = computed(() => data.value?.pagination);

  const { mutate: reviewSubmission, isPending: reviewing } = useMutation({
    mutationFn: ({ id, status, feedback }: { id: string; status: 'approved' | 'rejected'; feedback?: string }) =>
      adminReviewSubmission(id, { status, feedback }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-tasks'] }),
  });

  // Approve cepat dari tabel; penolakan selalu lewat halaman detail karena
  // butuh feedback dan pemeriksaan soal beserta jawabannya
  function approve(id: string) {
    reviewSubmission({ id, status: 'approved' });
  }

  return {
    submissions, pagination, isLoading,
    statusFilter, page,
    reviewing,
    approve,
  };
}

// ── Helper tampilan yang dipakai bersama halaman list dan detail ─────────────

export const taskStatusBadge: Record<string, string> = {
  submitted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  approved:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  rejected:  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export const taskStatusLabel: Record<string, string> = {
  submitted: 'Menunggu',
  approved:  'Disetujui',
  rejected:  'Ditolak',
};

export const taskFilterOptions: { label: string; value: string }[] = [
  { label: 'Semua', value: '' },
  { label: 'Menunggu', value: 'submitted' },
  { label: 'Disetujui', value: 'approved' },
  { label: 'Ditolak', value: 'rejected' },
];

export function formatTaskDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function formatTaskDateTime(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function userInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}
