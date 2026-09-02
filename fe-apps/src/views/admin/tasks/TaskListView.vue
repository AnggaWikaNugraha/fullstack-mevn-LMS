<script setup lang="ts">
import {
  useTaskReview,
  taskFilterOptions,
  taskStatusBadge,
  taskStatusLabel,
  formatTaskDate,
  userInitials,
} from '@/composables/admin/useTaskReview';

const {
  submissions,
  pagination,
  isLoading,
  statusFilter,
  page,
  reviewing,
  approve,
} = useTaskReview();

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
        v-for="opt in taskFilterOptions"
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
            <th class="px-4 py-3 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <tr
            v-for="sub in submissions"
            :key="sub._id"
            class="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
          >
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
                  {{ userInitials(sub.userId.name) }}
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ sub.userId.name }}</p>
                  <p class="text-xs text-gray-400">{{ sub.userId.email }}</p>
                </div>
              </div>
            </td>

            <!-- Lesson / Kursus -->
            <td class="px-4 py-3">
              <RouterLink
                :to="`/admin/tasks/${sub._id}`"
                class="font-medium text-gray-800 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1"
              >
                {{ sub.lessonId?.title ?? '—' }}
              </RouterLink>
              <p class="text-xs text-gray-400 line-clamp-1">
                {{ sub.courseId?.title ?? '—' }}
              </p>
            </td>

            <!-- Status -->
            <td class="px-4 py-3">
              <span
                class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="taskStatusBadge[sub.status]"
              >
                {{ taskStatusLabel[sub.status] }}
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
              {{ formatTaskDate(sub.submittedAt) }}
            </td>

            <!-- Aksi: review lengkap di halaman detail, approve cepat dari sini -->
            <td class="px-4 py-3">
              <div class="flex gap-2 justify-end">
                <button
                  v-if="sub.status === 'submitted'"
                  class="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-medium disabled:opacity-40 transition"
                  :disabled="reviewing"
                  @click="approve(sub._id)"
                >
                  Setujui
                </button>
                <RouterLink
                  :to="`/admin/tasks/${sub._id}`"
                  class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition whitespace-nowrap"
                >
                  {{ sub.status === 'submitted' ? 'Review' : 'Detail' }}
                </RouterLink>
              </div>
            </td>
          </tr>
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
