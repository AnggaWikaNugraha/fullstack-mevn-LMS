<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useCourseDetail } from '@/composables/courses/useCourseDetail';
import { useProgress } from '@/composables/courses/useProgress';
import { useCheckout } from '@/composables/checkout/useCheckout';
import { formatRupiah } from '@/utils/format';
import VideoPlayer from '@/components/course/VideoPlayer.vue';
import QuizPlayer from '@/components/course/QuizPlayer.vue';
import TaskPlayer from '@/components/course/TaskPlayer.vue';
import CourseSidebar from '@/components/course/CourseSidebar.vue';

const route = useRoute();
const auth = useAuthStore();
const courseId = route.params.id as string;

const {
  courseData,
  isLoading,
  isError,
  activeLessonId,
  activeLesson,
  nextLesson,
  selectLesson,
  course,
  isEnrolled,
} = useCourseDetail(courseId);

const {
  isPending,
  handleMarkComplete,
  handleVideoEnded,
} = useProgress(courseId, activeLesson);

const {
  startCheckout,
  isPending: isCheckingOut,
} = useCheckout(courseId);
</script>

<template>
  <!-- Mobile: kolom vertikal | Desktop (lg+): berdampingan dengan tinggi penuh -->
  <div class="flex flex-col lg:flex-row lg:h-[calc(100vh-64px)]">

    <!-- ── Skeleton loading ───────────────────────────────────────────── -->
    <div v-if="isLoading" class="flex flex-col lg:flex-row w-full">
      <div class="flex-1 space-y-4 bg-gray-950">
        <div class="w-full bg-gray-800 animate-pulse" style="aspect-ratio:16/9"></div>
        <div class="bg-white p-4 lg:p-6 space-y-3">
          <div class="h-5 w-2/3 bg-gray-200 animate-pulse rounded"></div>
          <div class="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
          <div class="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
      <div class="h-48 lg:h-auto lg:w-80 lg:shrink-0 bg-gray-100 animate-pulse border-t lg:border-t-0 lg:border-l border-gray-200"></div>
    </div>

    <!-- ── Error state ───────────────────────────────────────────────── -->
    <div v-else-if="isError" class="flex-1 flex items-center justify-center p-6">
      <div class="text-center">
        <p class="text-gray-500 mb-4">Kurs tidak ditemukan atau terjadi kesalahan.</p>
        <RouterLink to="/" class="text-indigo-600 hover:underline text-sm">← Kembali ke beranda</RouterLink>
      </div>
    </div>

    <!-- ── Konten utama ──────────────────────────────────────────────── -->
    <template v-else-if="courseData">

      <!-- Kiri / atas: player + info lesson -->
      <main class="flex-1 lg:overflow-y-auto bg-gray-950">

        <!-- Video player — hanya untuk tipe video -->
        <VideoPlayer
          v-if="activeLesson?.type === 'video' || !activeLesson"
          :videoUrl="activeLesson?.video_url ?? null"
          :isLocked="activeLesson?.is_locked ?? false"
          @ended="handleVideoEnded"
        />

        <!-- Quiz player — hanya untuk tipe quiz, butuh login -->
        <div
          v-else-if="activeLesson.type === 'quiz'"
          class="bg-white min-h-[calc(100vh-64px-80px)]"
        >
          <QuizPlayer v-if="auth.isAuthenticated" :lesson="activeLesson" />
          <div v-else class="flex items-center justify-center py-24 px-6">
            <p class="text-gray-500 text-sm text-center">
              <RouterLink to="/auth/login" class="text-indigo-600 font-semibold hover:underline">Masuk</RouterLink>
              untuk mengerjakan quiz ini.
            </p>
          </div>
        </div>

        <!-- Task player — hanya untuk tipe task, butuh login -->
        <div
          v-else-if="activeLesson.type === 'task'"
          class="bg-white min-h-[calc(100vh-64px-80px)]"
        >
          <TaskPlayer v-if="auth.isAuthenticated" :lesson="activeLesson" />
          <div v-else class="flex items-center justify-center py-24 px-6">
            <p class="text-gray-500 text-sm text-center">
              <RouterLink to="/auth/login" class="text-indigo-600 font-semibold hover:underline">Masuk</RouterLink>
              untuk mengumpulkan tugas ini.
            </p>
          </div>
        </div>

        <!-- Info lesson di bawah player -->
        <div class="p-4 lg:p-6 bg-white">
          <RouterLink to="/" class="text-xs text-gray-400 hover:text-indigo-600">
            ← Semua Kurs
          </RouterLink>

          <div class="mt-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div class="flex-1 min-w-0">
              <h1 class="text-lg lg:text-xl font-bold text-gray-900">
                {{ activeLesson?.title ?? 'Pilih pelajaran' }}
              </h1>
              <p v-if="activeLesson?.description && activeLesson.type === 'video'" class="mt-2 text-sm text-gray-500 leading-relaxed">
                {{ activeLesson.description }}
              </p>
            </div>

            <!-- Tombol aksi — hanya untuk user yang sudah login -->
            <div
              v-if="auth.isAuthenticated && activeLesson"
              class="flex items-center gap-2 sm:shrink-0"
            >
              <!-- Tandai selesai + badge selesai — hanya untuk video -->
              <template v-if="activeLesson.type === 'video'">
                <button
                  v-if="!activeLesson.is_done"
                  class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                  :disabled="isPending || activeLesson.is_locked"
                  @click="handleMarkComplete"
                >
                  <svg v-if="isPending" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {{ isPending ? 'Menyimpan...' : 'Tandai Selesai' }}
                </button>
                <span
                  v-else
                  class="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Selesai
                </span>
              </template>

              <!-- Badge selesai untuk quiz dan task -->
              <span
                v-else-if="activeLesson.is_done"
                class="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Selesai
              </span>

              <!-- Tombol lesson selanjutnya — tampil untuk semua tipe -->
              <button
                v-if="nextLesson && activeLesson.is_done"
                class="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                @click="selectLesson(nextLesson._id)"
              >
                Selanjutnya →
              </button>
            </div>
          </div>

          <!-- CTA beli kurs — untuk course berbayar yang belum dibeli -->
          <div
            v-if="auth.isAuthenticated && course && !course.isFree && !isEnrolled"
            class="mt-4 flex items-center justify-between gap-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg"
          >
            <div>
              <p class="text-sm font-semibold text-indigo-800">Beli kurs ini untuk akses penuh</p>
              <p class="text-lg font-bold text-indigo-700">{{ formatRupiah(course.price) }}</p>
            </div>
            <button
              class="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition shrink-0"
              :disabled="isCheckingOut"
              @click="startCheckout()"
            >
              {{ isCheckingOut ? 'Memproses...' : 'Beli Sekarang' }}
            </button>
          </div>

          <!-- Prompt login untuk pengunjung yang belum masuk -->
          <div
            v-if="!auth.isAuthenticated"
            class="mt-4 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-amber-800">
              <RouterLink to="/auth/login" class="font-semibold hover:underline">Masuk</RouterLink>
              atau
              <RouterLink to="/auth/register" class="font-semibold hover:underline">daftar</RouterLink>
              untuk menyimpan progress dan membuka semua pelajaran.
            </p>
          </div>
        </div>
      </main>

      <!-- Kanan / bawah: sidebar materi kurs -->
      <!-- Mobile: full width, muncul di bawah video. Desktop: kolom kanan 320px -->
      <div class="lg:w-80 lg:shrink-0 lg:overflow-hidden border-t lg:border-t-0 lg:border-l border-gray-200">
        <CourseSidebar
          :course="courseData.course"
          :activeLessonId="activeLessonId"
          @select-lesson="selectLesson"
        />
      </div>
    </template>
  </div>
</template>
