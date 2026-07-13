<script setup lang="ts">
import { watch } from 'vue';
import { useQuiz } from '@/composables/courses/useQuiz';
import type { Lesson } from '@/types/courses';

const props = defineProps<{
  lesson: Lesson;
}>();

const {
  questions,
  loadingQuestions,
  lastAttempt,
  loadingAttempt,
  isRetrying,
  selectedAnswers,
  allAnswered,
  submitResult,
  submitting,
  initAnswers,
  submit,
} = useQuiz(props.lesson._id);

watch(questions, initAnswers, { immediate: true });

const displayResult = () => submitResult.value ?? lastAttempt.value ?? null;

function handleRetry() {
  submitResult.value = null;
  isRetrying.value = true;
  initAnswers();
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-6 px-4">

    <!-- Memuat soal -->
    <div v-if="loadingQuestions || loadingAttempt" class="flex justify-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Memuat soal...</p>
    </div>

    <!-- Tampilkan hasil setelah submit atau jika sudah pernah mengerjakan (dan tidak sedang retry) -->
    <div v-else-if="(submitResult || lastAttempt) && !isRetrying" class="space-y-4">
      <div
        class="rounded-2xl p-8 text-center"
        :class="displayResult()?.passed
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'"
      >
        <div class="text-5xl mb-4">{{ displayResult()?.passed ? '✅' : '❌' }}</div>
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {{ displayResult()?.passed ? 'Selamat, kamu lulus!' : 'Belum lulus' }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-1">
          Skor: <span class="font-bold">{{ displayResult()?.score }}</span> / 100
          &nbsp;|&nbsp;
          Benar: <span class="font-bold">{{ displayResult()?.correct_count }}</span> / {{ displayResult()?.total_questions }} soal
        </p>
        <p class="text-sm text-gray-400 dark:text-gray-500">
          Nilai minimum lulus: {{ props.lesson.passing_score }}
        </p>
      </div>

      <!-- Coba lagi jika belum lulus -->
      <button
        v-if="!displayResult()?.passed"
        class="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
        @click="handleRetry"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Form soal -->
    <div v-else-if="questions && questions.length > 0" class="space-y-8">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ questions.length }} soal &nbsp;·&nbsp; Nilai lulus ≥ {{ props.lesson.passing_score }}
      </p>

      <div v-for="(q, qi) in questions" :key="q._id">
        <p class="font-medium text-gray-800 dark:text-gray-100 mb-3 leading-relaxed">
          {{ qi + 1 }}. {{ q.question }}
        </p>
        <div class="flex flex-col gap-2">
          <label
            v-for="(opt, oi) in q.options"
            :key="oi"
            class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition"
            :class="selectedAnswers[qi] === oi
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-400'
              : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500'"
          >
            <input
              type="radio"
              :name="`q-${qi}`"
              :value="oi"
              class="sr-only"
              @change="selectedAnswers[qi] = oi"
            />
            <span
              class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition"
              :class="selectedAnswers[qi] === oi
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'"
            >
              {{ String.fromCharCode(65 + oi) }}
            </span>
            <span class="text-sm text-gray-800 dark:text-gray-100">{{ opt }}</span>
          </label>
        </div>
      </div>

      <button
        class="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        :disabled="!allAnswered || submitting"
        @click="submit()"
      >
        {{ submitting ? 'Mengirim...' : 'Kumpulkan Jawaban' }}
      </button>
    </div>

    <!-- Tidak ada soal -->
    <div v-else class="flex justify-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Soal belum tersedia.</p>
    </div>

  </div>
</template>
