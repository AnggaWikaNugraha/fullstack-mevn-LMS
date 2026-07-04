import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { updateProgress } from '@/api/courses';

export function useProgress(courseId: string) {
  const queryClient = useQueryClient();

  const { mutate: markComplete, isPending } = useMutation({
    mutationFn: (lessonId: string) => updateProgress({ lesson_id: lessonId }),
    onSuccess: () => {
      // Invalidate detail kurs agar is_done dan is_locked dihitung ulang untuk user
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },
  });

  return { markComplete, isPending };
}
