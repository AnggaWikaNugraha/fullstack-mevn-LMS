import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { adminGetSubmission, adminReviewSubmission } from '@/api/admin/tasks';

export function useTaskReviewDetail(submissionId: string) {
  const qc = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-task', submissionId],
    queryFn: () => adminGetSubmission(submissionId).then((r) => r.data.data!),
  });

  const submission = computed(() => data.value?.submission);
  const history = computed(() => data.value?.history ?? []);

  const lesson = computed(() => submission.value?.lessonId ?? null);
  const course = computed(() => submission.value?.courseId ?? null);
  const chapter = computed(() => lesson.value?.chapterId ?? null);
  const courseModule = computed(() => chapter.value?.moduleId ?? null);

  // Feedback dipakai bersama untuk approve maupun reject; diisi ulang dari
  // feedback lama supaya admin bisa merevisi keputusan sebelumnya
  const feedbackText = ref('');
  watch(submission, (val) => {
    if (val) feedbackText.value = val.feedback ?? '';
  }, { immediate: true });

  // Konfirmasi penolakan ditahan satu langkah agar tidak terjadi klik tidak sengaja
  const confirmingReject = ref(false);

  const { mutate: review, isPending: reviewing } = useMutation({
    mutationFn: (payload: { status: 'approved' | 'rejected'; feedback?: string }) =>
      adminReviewSubmission(submissionId, payload),
    onSuccess: () => {
      confirmingReject.value = false;
      qc.invalidateQueries({ queryKey: ['admin-task', submissionId] });
      qc.invalidateQueries({ queryKey: ['admin-tasks'] });
    },
  });

  function approve() {
    review({ status: 'approved', feedback: feedbackText.value.trim() || undefined });
  }
  function reject() {
    review({ status: 'rejected', feedback: feedbackText.value.trim() || undefined });
  }
  function backToList() {
    router.push({ name: 'admin-tasks' });
  }

  return {
    submission, history, lesson, course, chapter, courseModule,
    isLoading, isError,
    feedbackText, confirmingReject,
    reviewing, approve, reject, backToList,
  };
}
