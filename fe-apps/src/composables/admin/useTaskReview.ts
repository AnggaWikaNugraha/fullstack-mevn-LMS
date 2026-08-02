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

  // ── State form reject ────────────────────────────────────────────────────────
  const rejectingId = ref<string | null>(null);
  const feedbackText = ref('');

  function startReject(id: string) {
    rejectingId.value = id;
    feedbackText.value = '';
  }
  function cancelReject() {
    rejectingId.value = null;
  }
  function submitReject(id: string) {
    reviewSubmission({ id, status: 'rejected', feedback: feedbackText.value || undefined });
    rejectingId.value = null;
  }
  function approve(id: string) {
    reviewSubmission({ id, status: 'approved' });
  }

  return {
    submissions, pagination, isLoading,
    statusFilter, page,
    reviewing,
    rejectingId, feedbackText, startReject, cancelReject, submitReject,
    approve,
  };
}
