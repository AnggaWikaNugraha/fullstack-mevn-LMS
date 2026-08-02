<script setup lang="ts">
import { watch, computed } from 'vue';
import { useTask } from '@/composables/courses/useTask';
import type { Lesson } from '@/types/courses';

const props = defineProps<{
  lesson: Lesson;
}>();

const {
  existingSubmission,
  loadingSubmission,
  submissionUrl,
  note,
  submitting,
  submitted,
  submit,
} = useTask(props.lesson._id);

watch(existingSubmission, (val) => {
  if (val) {
    submissionUrl.value = val.submission_url;
    note.value = val.note;
  }
}, { immediate: true });

// Status efektif: pakai existingSubmission jika ada, fallback ke 'submitted' setelah mutasi sukses
const effectiveStatus = computed(() =>
  existingSubmission.value?.status ?? (submitted.value ? 'submitted' : null)
);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
</script>

<template>
  <div class="max-w-2xl mx-auto py-6 px-4">

    <!-- Memuat data -->
    <div v-if="loadingSubmission" class="flex justify-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Memuat data tugas...</p>
    </div>

    <!-- Sudah pernah submit — tampilan berdasarkan status -->
    <div v-else-if="effectiveStatus" class="space-y-4">

      <!-- Disetujui -->
      <div
        v-if="effectiveStatus === 'approved'"
        class="rounded-2xl p-8 text-center bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
      >
        <div class="text-5xl mb-4">✅</div>
        <h3 class="text-xl font-semibold text-green-700 dark:text-green-300 mb-1">Tugas Disetujui</h3>
        <p v-if="existingSubmission" class="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Dikirim pada {{ formatDate(existingSubmission.submittedAt) }}
        </p>
        <a
          :href="existingSubmission?.submission_url ?? submissionUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
        >
          Lihat Link Tugas →
        </a>
      </div>

      <!-- Ditolak -->
      <div
        v-else-if="effectiveStatus === 'rejected'"
        class="rounded-2xl p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
      >
        <div class="text-center mb-4">
          <div class="text-5xl mb-4">❌</div>
          <h3 class="text-xl font-semibold text-red-700 dark:text-red-300 mb-1">Tugas Ditolak</h3>
          <p v-if="existingSubmission" class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Dikirim pada {{ formatDate(existingSubmission.submittedAt) }}
          </p>
          <a
            :href="existingSubmission?.submission_url ?? submissionUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Lihat Link Tugas →
          </a>
        </div>
        <div
          v-if="existingSubmission?.feedback"
          class="mt-4 rounded-xl bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-700 px-4 py-3"
        >
          <p class="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Feedback Admin:</p>
          <p class="text-sm text-red-800 dark:text-red-200">{{ existingSubmission.feedback }}</p>
        </div>
        <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Silakan perbaiki tugasmu dan kumpulkan ulang.
        </p>
      </div>

      <!-- Menunggu Review -->
      <div
        v-else
        class="rounded-2xl p-8 text-center bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
      >
        <div class="text-5xl mb-4">📎</div>
        <h3 class="text-xl font-semibold text-yellow-700 dark:text-yellow-300 mb-1">Menunggu Review</h3>
        <p v-if="existingSubmission" class="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Dikirim pada {{ formatDate(existingSubmission.submittedAt) }}
        </p>
        <a
          :href="existingSubmission?.submission_url ?? submissionUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block text-indigo-600 dark:text-indigo-400 hover:underline font-medium mb-3"
        >
          Lihat Link Tugas →
        </a>
        <p v-if="existingSubmission?.note" class="text-sm text-gray-600 dark:text-gray-300 italic">
          Catatan: {{ existingSubmission.note }}
        </p>
      </div>
    </div>

    <!-- Form pengumpulan tugas -->
    <div v-else class="space-y-5">
      <p v-if="props.lesson.description" class="text-gray-600 dark:text-gray-300 leading-relaxed">
        {{ props.lesson.description }}
      </p>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" for="submission_url">
          Link Tugas <span class="text-red-500">*</span>
        </label>
        <input
          id="submission_url"
          v-model="submissionUrl"
          type="url"
          placeholder="https://github.com/username/repo atau Google Drive..."
          class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Pastikan link dapat diakses publik.</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" for="note">
          Catatan (opsional)
        </label>
        <textarea
          id="note"
          v-model="note"
          rows="3"
          placeholder="Tuliskan catatan atau penjelasan singkat..."
          class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
        />
      </div>

      <button
        class="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        :disabled="!submissionUrl || submitting"
        @click="submit()"
      >
        {{ submitting ? 'Mengirim...' : 'Kumpulkan Tugas' }}
      </button>
    </div>

  </div>
</template>
