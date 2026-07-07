import { ref, computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { getQuizQuestions, submitQuizAnswers, getMyAttempt } from '@/api/quiz';
import type { QuizAttemptResult } from '@/types/quiz';

export function useQuiz(lessonId: string) {
  const queryClient = useQueryClient();

  // Ambil daftar soal
  const { data: questions, isLoading: loadingQuestions } = useQuery({
    queryKey: ['quiz-questions', lessonId],
    queryFn: () => getQuizQuestions(lessonId).then((r) => r.data.data!.questions),
    staleTime: Infinity, // soal tidak berubah selama sesi
  });

  // Ambil hasil attempt terakhir (null jika belum pernah mencoba)
  const { data: lastAttempt, isLoading: loadingAttempt } = useQuery({
    queryKey: ['quiz-attempt', lessonId],
    queryFn: () => getMyAttempt(lessonId).then((r) => r.data.data!.attempt),
    staleTime: 0,
  });

  // Jawaban yang dipilih user: index soal → index pilihan
  const selectedAnswers = ref<(number | null)[]>([]);

  // Reset jawaban saat soal tersedia
  const initAnswers = () => {
    if (questions.value) {
      selectedAnswers.value = Array(questions.value.length).fill(null);
    }
  };

  const allAnswered = computed(
    () =>
      selectedAnswers.value.length > 0 &&
      selectedAnswers.value.every((a) => a !== null),
  );

  // Kirim jawaban ke server
  const submitResult = ref<QuizAttemptResult | null>(null);
  const { mutate: submit, isPending: submitting } = useMutation({
    mutationFn: () =>
      submitQuizAnswers(lessonId, { answers: selectedAnswers.value as number[] }).then(
        (r) => r.data.data!.attempt,
      ),
    onSuccess: (result) => {
      submitResult.value = result;
      // Invalidate agar is_done di sidebar kurs ikut terupdate
      queryClient.invalidateQueries({ queryKey: ['quiz-attempt', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['course-progress'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  return {
    questions,
    loadingQuestions,
    lastAttempt,
    loadingAttempt,
    selectedAnswers,
    allAnswered,
    submitResult,
    submitting,
    initAnswers,
    submit,
  };
}
