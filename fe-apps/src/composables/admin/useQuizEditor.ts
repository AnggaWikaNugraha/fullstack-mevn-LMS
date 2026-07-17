import { ref } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import {
  adminGetQuizQuestions, adminCreateQuestion, adminUpdateQuestion, adminDeleteQuestion,
  type AdminQuizQuestion,
} from '@/api/admin/quiz';

const emptyForm = () => ({ question: '', options: ['', '', '', ''] as string[], correct_index: 0 });

export function useQuizEditor(lessonId: string) {
  const qc = useQueryClient();

  const { data: questions, isLoading } = useQuery({
    queryKey: ['admin-quiz', lessonId],
    queryFn: () => adminGetQuizQuestions(lessonId).then((r) => r.data.data!.questions),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-quiz', lessonId] });

  const newQuestion = ref(emptyForm());
  const editingQuestion = ref<AdminQuizQuestion | null>(null);
  const showAddForm = ref(false);

  const { mutate: addQuestion, isPending: adding } = useMutation({
    mutationFn: () => adminCreateQuestion(lessonId, {
      question: newQuestion.value.question,
      options: newQuestion.value.options,
      correct_index: newQuestion.value.correct_index,
    }),
    onSuccess: () => { invalidate(); newQuestion.value = emptyForm(); showAddForm.value = false; },
  });

  const { mutate: saveQuestion, isPending: saving } = useMutation({
    mutationFn: () => adminUpdateQuestion(editingQuestion.value!._id, {
      question: editingQuestion.value!.question,
      options: editingQuestion.value!.options,
      correct_index: editingQuestion.value!.correct_index,
    }),
    onSuccess: () => { invalidate(); editingQuestion.value = null; },
  });

  const { mutate: removeQuestion } = useMutation({
    mutationFn: (id: string) => adminDeleteQuestion(id),
    onSuccess: invalidate,
  });

  function confirmDeleteQuestion(q: AdminQuizQuestion) {
    if (confirm(`Hapus soal "${q.question.slice(0, 40)}..."?`)) removeQuestion(q._id);
  }

  return {
    questions, isLoading,
    newQuestion, editingQuestion, showAddForm,
    addQuestion, adding,
    saveQuestion, saving,
    confirmDeleteQuestion,
  };
}
