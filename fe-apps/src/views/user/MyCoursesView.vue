<script setup lang="ts">
import { useMyEnrollments } from '@/composables/enrollments/useMyEnrollments';
import { formatDate, progressPercent } from '@/utils/format';

const {
  courses,
  isLoading,
  isError,
} = useMyEnrollments();
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Course Saya</h1>

    <!-- Skeleton -->
    <div v-if="isLoading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
        <div class="aspect-video bg-gray-200"></div>
        <div class="p-4 space-y-3">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          <div class="h-2 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="isError" class="text-center py-16">
      <p class="text-gray-500">Gagal memuat kurs. Coba muat ulang halaman.</p>
    </div>

    <!-- Kosong -->
    <div v-else-if="!courses.length" class="text-center py-20">
      <p class="text-gray-400 text-lg mb-4">Kamu belum memiliki kurs apapun.</p>
      <RouterLink
        to="/courses"
        class="inline-block px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
      >
        Jelajahi Kurs
      </RouterLink>
    </div>

    <!-- Daftar kurs -->
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterLink
        v-for="item in courses"
        :key="item.enrollment_id"
        :to="`/courses/${item.course._id}`"
        class="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        <!-- Cover -->
        <div class="aspect-video overflow-hidden bg-gray-100">
          <img
            :src="item.course.cover_url"
            :alt="item.course.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div class="p-4">
          <h2 class="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug mb-1">
            {{ item.course.title }}
          </h2>
          <p class="text-xs text-gray-400 mb-3">Bergabung {{ formatDate(item.enrolled_at) }}</p>

          <!-- Progress bar -->
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ item.completed_lessons }} / {{ item.course.total_lessons }} pelajaran</span>
              <span class="font-medium text-indigo-600">
                {{ progressPercent(item.completed_lessons, item.course.total_lessons) }}%
              </span>
            </div>
            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-indigo-500 rounded-full transition-all"
                :style="{ width: progressPercent(item.completed_lessons, item.course.total_lessons) + '%' }"
              ></div>
            </div>
          </div>

          <p class="mt-3 text-xs font-medium text-indigo-600 group-hover:underline">Lanjut Belajar →</p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
