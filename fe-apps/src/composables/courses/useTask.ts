import { ref } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { submitTask as submitTaskApi, getMySubmission } from '@/api/tasks';

export function useTask(lessonId: string) {
  const queryClient = useQueryClient();

  // Ambil submission yang sudah pernah dibuat (null jika belum)
  const { data: existingSubmission, isLoading: loadingSubmission } = useQuery({
    queryKey: ['task-submission', lessonId],
    queryFn: () => getMySubmission(lessonId).then((r) => r.data.data!.submission),
    staleTime: 0,
  });

  const submissionUrl = ref('');
  const note = ref('');

  const { mutate: submit, isPending: submitting, isSuccess: submitted } = useMutation({
    mutationFn: () =>
      submitTaskApi(lessonId, { submission_url: submissionUrl.value, note: note.value }).then(
        (r) => r.data.data!.submission,
      ),
    onSuccess: () => {
      // Invalidate agar progress sidebar dan persentase kurs terupdate
      queryClient.invalidateQueries({ queryKey: ['task-submission', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['course-progress'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  return {
    existingSubmission,
    loadingSubmission,
    submissionUrl,
    note,
    submitting,
    submitted,
    submit,
  };
}
