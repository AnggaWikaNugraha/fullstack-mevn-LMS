import { type ComputedRef } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useAuthStore } from '@/stores/authStore';
import { updateProgress } from '@/api/courses';
import type { Lesson } from '@/types/courses';

export function useProgress(courseId: string, activeLesson: ComputedRef<Lesson | null>) {
  const queryClient = useQueryClient();
  const auth = useAuthStore();

  const { mutate: markComplete, isPending } = useMutation({
    mutationFn: (lessonId: string) => updateProgress({ lesson_id: lessonId }),
    onSuccess: () => {
      // Invalidate detail kurs agar is_done dan is_locked dihitung ulang untuk user
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },
  });

  function handleMarkComplete() {
    if (!activeLesson.value) return;
    markComplete(activeLesson.value._id);
  }

  // Hanya video yang bisa otomatis ditandai selesai saat playback berakhir
  function handleVideoEnded() {
    if (!auth.isAuthenticated || !activeLesson.value) return;
    if (activeLesson.value.type !== 'video') return;
    if (!activeLesson.value.is_done) {
      markComplete(activeLesson.value._id);
    }
  }

  return { markComplete, isPending, handleMarkComplete, handleVideoEnded };
}
