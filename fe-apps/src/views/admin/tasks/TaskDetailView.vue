<script setup lang="ts">
import { useRoute } from 'vue-router';
import {
  useTaskReviewDetail,
} from '@/composables/admin/useTaskReviewDetail';
import {
  taskStatusBadge,
  taskStatusLabel,
  formatTaskDate,
  formatTaskDateTime,
  userInitials,
} from '@/composables/admin/useTaskReview';
import { ArrowLeft, ExternalLink, FileText, MessageSquare, History } from '@lucide/vue';

const route = useRoute();
const submissionId = route.params.id as string;

const {
  submission, history, lesson, course, chapter, courseModule,
  isLoading, isError,
  feedbackText, confirmingReject,
  reviewing, approve, reject, backToList,
} = useTaskReviewDetail(submissionId);
</script>

<template>
  <div class="max-w-5xl space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-3">
      <RouterLink
        to="/admin/tasks"
        class="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" /> Task Review
      </RouterLink>
      <span class="text-gray-300 dark:text-gray-600">/</span>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Detail Submission</h1>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="py-16 text-center text-gray-400">Memuat data...</div>

    <!-- Gagal / tidak ditemukan -->
    <div v-else-if="isError || !submission" class="py-16 text-center space-y-3">
      <p class="text-gray-400">Submission tidak ditemukan.</p>
      <button
        class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        @click="backToList()"
      >
        Kembali ke daftar
      </button>
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-3">
      <!-- ── Kolom utama ─────────────────────────────────────────────────── -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Header lesson -->
        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          <div class="flex items-start justify-between gap-4 mb-2">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ lesson?.title ?? 'Lesson dihapus' }}
            </h2>
            <span
              class="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold"
              :class="taskStatusBadge[submission.status]"
            >
              {{ taskStatusLabel[submission.status] }}
            </span>
          </div>
          <p class="text-xs text-gray-400 dark:text-gray-500">
            {{ course?.title ?? 'Kursus dihapus' }}
            <template v-if="courseModule"> · {{ courseModule.title }}</template>
            <template v-if="chapter"> · {{ chapter.title }}</template>
          </p>
        </div>

        <!-- Soal tugas -->
        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div class="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <FileText class="w-4 h-4 text-indigo-500" />
            <h3 class="font-semibold text-sm text-gray-800 dark:text-gray-100">Soal Tugas</h3>
          </div>
          <div class="px-5 py-4">
            <p
              v-if="lesson?.description"
              class="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line"
            >{{ lesson.description }}</p>
            <p v-else class="text-sm text-gray-400 italic">
              Lesson ini belum memiliki deskripsi tugas.
            </p>
          </div>
        </div>

        <!-- Jawaban peserta -->
        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div class="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <ExternalLink class="w-4 h-4 text-indigo-500" />
            <h3 class="font-semibold text-sm text-gray-800 dark:text-gray-100">Jawaban Peserta</h3>
            <span class="ml-auto text-xs text-gray-400">
              Dikumpulkan {{ formatTaskDateTime(submission.submittedAt) }}
            </span>
          </div>
          <div class="px-5 py-4 space-y-4">
            <div>
              <p class="text-xs font-medium text-gray-400 mb-1">Link tugas</p>
              <a
                :href="submission.submission_url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-start gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:underline break-all"
              >
                {{ submission.submission_url }}
                <ExternalLink class="w-3.5 h-3.5 mt-0.5 shrink-0" />
              </a>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-400 mb-1">Catatan peserta</p>
              <p
                v-if="submission.note"
                class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line"
              >{{ submission.note }}</p>
              <p v-else class="text-sm text-gray-400 italic">Tidak ada catatan.</p>
            </div>
          </div>
        </div>

        <!-- Panel keputusan -->
        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div class="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <MessageSquare class="w-4 h-4 text-indigo-500" />
            <h3 class="font-semibold text-sm text-gray-800 dark:text-gray-100">Keputusan Review</h3>
          </div>
          <div class="px-5 py-4 space-y-4">
            <!-- Keputusan sebelumnya bisa diubah kapan saja -->
            <p
              v-if="submission.status !== 'submitted'"
              class="text-xs text-gray-500 dark:text-gray-400"
            >
              Tugas ini sudah ditandai
              <span class="font-semibold">{{ taskStatusLabel[submission.status].toLowerCase() }}</span>.
              Keputusan masih bisa diubah di bawah.
            </p>

            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1" for="feedback">
                Feedback untuk peserta
                <span class="text-gray-400">(wajib diisi saat menolak)</span>
              </label>
              <textarea
                id="feedback"
                v-model="feedbackText"
                rows="4"
                placeholder="Tuliskan catatan penilaian, alasan penolakan, atau saran perbaikan..."
                class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <!-- Konfirmasi tolak -->
            <div
              v-if="confirmingReject"
              class="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 space-y-3"
            >
              <p class="text-sm text-red-700 dark:text-red-300">
                Tolak tugas ini? Progress lesson peserta akan dibatalkan dan feedback di atas dikirim ke peserta.
              </p>
              <div class="flex gap-2">
                <button
                  class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium disabled:opacity-40 transition"
                  :disabled="reviewing"
                  @click="reject()"
                >
                  {{ reviewing ? 'Memproses...' : 'Ya, Tolak Tugas' }}
                </button>
                <button
                  class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  @click="confirmingReject = false"
                >
                  Batal
                </button>
              </div>
            </div>

            <!-- Aksi utama -->
            <div v-else class="flex flex-wrap gap-2">
              <button
                class="px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold disabled:opacity-40 transition"
                :disabled="reviewing"
                @click="approve()"
              >
                {{ reviewing ? 'Memproses...' : 'Setujui Tugas' }}
              </button>
              <button
                class="px-5 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 text-sm font-semibold disabled:opacity-40 transition"
                :disabled="reviewing || !feedbackText.trim()"
                @click="confirmingReject = true"
              >
                Tolak Tugas
              </button>
              <button
                class="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                @click="backToList()"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Sidebar ─────────────────────────────────────────────────────── -->
      <div class="space-y-6">
        <!-- Peserta -->
        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          <p class="text-xs font-medium text-gray-400 mb-3">Peserta</p>
          <div class="flex items-center gap-3">
            <img
              v-if="submission.userId.avatar_url"
              :src="submission.userId.avatar_url"
              :alt="submission.userId.name"
              class="w-11 h-11 rounded-full object-cover shrink-0"
            />
            <div
              v-else
              class="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-sm font-bold shrink-0"
            >
              {{ userInitials(submission.userId.name) }}
            </div>
            <div class="min-w-0">
              <p class="font-medium text-gray-900 dark:text-white truncate">{{ submission.userId.name }}</p>
              <p class="text-xs text-gray-400 truncate">{{ submission.userId.email }}</p>
            </div>
          </div>
          <RouterLink
            :to="`/admin/users/${submission.userId._id}`"
            class="mt-4 block text-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Lihat profil peserta →
          </RouterLink>
        </div>

        <!-- Kursus -->
        <div v-if="course" class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          <p class="text-xs font-medium text-gray-400 mb-3">Kursus</p>
          <img
            v-if="course.cover_url"
            :src="course.cover_url"
            :alt="course.title"
            class="w-full h-28 rounded-xl object-cover mb-3"
          />
          <p class="font-medium text-sm text-gray-900 dark:text-white">{{ course.title }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ course.topic_name }} · {{ course.level }}</p>
          <RouterLink
            :to="`/admin/courses/${course._id}/content`"
            class="mt-4 block text-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Buka konten kursus →
          </RouterLink>
        </div>

        <!-- Riwayat tugas lain di kursus yang sama -->
        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div class="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <History class="w-4 h-4 text-indigo-500" />
            <h3 class="font-semibold text-sm text-gray-800 dark:text-gray-100">Tugas Lain</h3>
          </div>
          <div v-if="!history.length" class="px-5 py-5 text-center text-xs text-gray-400">
            Belum ada tugas lain di kursus ini.
          </div>
          <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
            <RouterLink
              v-for="item in history"
              :key="item._id"
              :to="`/admin/tasks/${item._id}`"
              class="flex items-center gap-2 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
            >
              <div class="min-w-0 flex-1">
                <p class="text-xs font-medium text-gray-800 dark:text-gray-100 truncate">
                  {{ item.lessonId?.title ?? 'Lesson dihapus' }}
                </p>
                <p class="text-[11px] text-gray-400">{{ formatTaskDate(item.submittedAt) }}</p>
              </div>
              <span
                class="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                :class="taskStatusBadge[item.status]"
              >
                {{ taskStatusLabel[item.status] }}
              </span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
