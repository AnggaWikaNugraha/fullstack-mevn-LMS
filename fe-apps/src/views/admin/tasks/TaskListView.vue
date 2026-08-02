<script setup lang="ts">
import { useTaskReview } from '@/composables/admin/useTaskReview';

const {
  submissions,
  pagination,
  isLoading,
  statusFilter,
  page,
  reviewing,
  rejectingId,
  feedbackText,
  startReject,
  cancelReject,
  submitReject,
  approve,
} = useTaskReview();

const filterOptions: { label: string; value: string }[] = [
  { label: 'Semua', value: '' },
  { label: 'Menunggu', value: 'submitted' },
  { label: 'Disetujui', value: 'approved' },
  { label: 'Ditolak', value: 'rejected' },
];

const statusBadge: Record<string, string> = {
  submitted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  approved:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  rejected:  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};
const statusLabel: Record<string, string> = {
  submitted: 'Menunggu',
  approved:  'Disetujui',
  rejected:  'Ditolak',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

function setFilter(val: string) {
  statusFilter.value = val;
  page.value = 1;
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Task Review</h1>

    <!-- Filter pills -->
    <div class="flex gap-2 flex-wrap">
      <button
        v-for="opt in filterOptions"
        :key="opt.value"
        class="px-4 py-1.5 rounded-full text-sm font-medium border transition"
        :class="statusFilter === opt.value
          ? 'bg-indigo-600 text-white border-indigo-600'
          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-400'"
        @click="setFilter(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="py-16 text-center text-gray-400">Memuat data...</div>

    <!-- Kosong -->
    <div v-else-if="!submissions.length" class="py-16 text-center text-gray-400">
      Tidak ada submission ditemukan.
    </div>

    <!-- Tabel -->
    <div v-else class="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
          <tr>
            <th class="px-4 py-3 text-left font-medium">Peserta</th>
            <th class="px-4 py-3 text-left font-medium">Lesson / Kursus</th>
            <th class="px-4 py-3 text-left font-medium">Status</th>
            <th class="px-4 py-3 text-left font-medium">Link Tugas</th>
            <th class="px-4 py-3 text-left font-medium">Dikumpulkan</th>
            <th class="px-4 py-3 text-left font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <template v-for="sub in submissions" :key="sub._id">
            <!-- Baris utama -->
            <tr class="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition">
              <!-- Peserta -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img
                    v-if="sub.userId.avatar_url"
                    :src="sub.userId.avatar_url"
                    :alt="sub.userId.name"
                    class="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div
                    v-else
                    class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0"
                  >
                    {{ initials(sub.userId.name) }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ sub.userId.name }}</p>
                    <p class="text-xs text-gray-400">{{ sub.userId.email }}</p>
                  </div>
                </div>
              </td>

              <!-- Lesson / Kursus -->
              <td class="px-4 py-3">
                <p class="font-medium text-gray-800 dark:text-gray-100 line-clamp-1">
                  {{ sub.lessonId?.title ?? '—' }}
                </p>
                <p class="text-xs text-gray-400 line-clamp-1">
                  {{ sub.courseId?.title ?? '—' }}
                </p>
              </td>

              <!-- Status -->
              <td class="px-4 py-3">
                <span
                  class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="statusBadge[sub.status]"
                >
                  {{ statusLabel[sub.status] }}
                </span>
              </td>

              <!-- Link Tugas -->
              <td class="px-4 py-3">
                <a
                  :href="sub.submission_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-indigo-600 dark:text-indigo-400 hover:underline text-xs truncate max-w-[180px] inline-block"
                >
                  {{ sub.submission_url }}
                </a>
              </td>

              <!-- Tanggal -->
              <td class="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {{ formatDate(sub.submittedAt) }}
              </td>

              <!-- Aksi -->
              <td class="px-4 py-3">
                <div v-if="sub.status === 'submitted'" class="flex gap-2">
                  <button
                    class="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-medium disabled:opacity-40 transition"
                    :disabled="reviewing"
                    @click="approve(sub._id)"
                  >
                    Setujui
                  </button>
                  <button
                    class="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 text-xs font-medium disabled:opacity-40 transition"
                    :disabled="reviewing"
                    @click="startReject(sub._id)"
                  >
                    Tolak
                  </button>
                </div>
                <span v-else class="text-xs text-gray-400">—</span>
              </td>
            </tr>

            <!-- Form reject (expand inline) -->
            <tr v-if="rejectingId === sub._id" class="bg-red-50 dark:bg-red-900/10">
              <td colspan="6" class="px-4 py-4">
                <div class="flex flex-col gap-3 max-w-xl">
                  <p class="text-sm font-medium text-red-700 dark:text-red-300">
                    Feedback penolakan untuk <span class="font-bold">{{ sub.userId.name }}</span>
                  </p>
                  <textarea
                    v-model="feedbackText"
                    rows="3"
                    placeholder="Tuliskan alasan penolakan atau saran perbaikan..."
                    class="w-full rounded-xl border border-red-300 dark:border-red-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-400 resize-none"
                  />
                  <div class="flex gap-2">
                    <button
                      class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium disabled:opacity-40 transition"
                      :disabled="reviewing"
                      @click="submitReject(sub._id)"
                    >
                      Konfirmasi Tolak
                    </button>
                    <button
                      class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      @click="cancelReject()"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.totalPages > 1" class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
      <span>Halaman {{ pagination.page }} dari {{ pagination.totalPages }}</span>
      <div class="flex gap-2">
        <button
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition"
          :disabled="page <= 1"
          @click="page--"
        >
          ← Sebelumnya
        </button>
        <button
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition"
          :disabled="page >= pagination.totalPages"
          @click="page++"
        >
          Selanjutnya →
        </button>
      </div>
    </div>
  </div>
</template>
