<script setup lang="ts">
import { useCourseList } from '@/composables/admin/useCourseList';
import { formatRupiah } from '@/utils/format';

const {
  courses: data,
  isLoading,
  togglePublish,
  confirmDelete,
  } = useCourseList();

</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Courses</h1>
        <p class="text-sm text-gray-500 mt-0.5">Kelola semua course (draft & published)</p>
      </div>
      <RouterLink
        to="/admin/courses/new"
        class="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
      >
        + Tambah Course
      </RouterLink>
    </div>

    <!-- Skeleton -->
    <div v-if="isLoading" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div v-for="i in 4" :key="i" class="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0 animate-pulse">
        <div class="w-16 h-12 bg-gray-200 rounded-lg shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          <div class="h-3 bg-gray-200 rounded w-1/5"></div>
        </div>
      </div>
    </div>

    <!-- Tabel -->
    <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div v-if="!data?.length" class="text-center py-16 text-gray-400 text-sm">
        Belum ada course. Klik "Tambah Course" untuk mulai.
      </div>

      <div
        v-for="course in data"
        :key="course._id"
        class="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
      >
        <!-- Cover -->
        <div class="w-16 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          <img :src="course.cover_url" :alt="course.title" class="w-full h-full object-cover" />
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 truncate">{{ course.title }}</p>
          <p class="text-xs text-gray-400 mt-0.5">
            {{ course.topic_name }} · {{ course.level }}
            · {{ course.total_lessons }} lesson
            · {{ course.total_students }} siswa
            · {{ course.isFree ? 'Gratis' : formatRupiah(course.price) }}
          </p>
        </div>

        <!-- Status badge -->
        <span
          class="px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
          :class="course.status === 'published'
            ? 'bg-green-100 text-green-700'
            : 'bg-amber-100 text-amber-700'"
        >
          {{ course.status === 'published' ? 'Published' : 'Draft' }}
        </span>

        <!-- Aksi -->
        <div class="flex items-center gap-2 shrink-0">
          <button
            class="px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors"
            :class="course.status === 'published'
              ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
              : 'border-green-200 text-green-700 hover:bg-green-50'"
            @click="togglePublish({ id: course._id, status: course.status === 'published' ? 'draft' : 'published' })"
          >
            {{ course.status === 'published' ? 'Unpublish' : 'Publish' }}
          </button>

          <RouterLink
            :to="`/admin/courses/${course._id}/content`"
            class="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Konten
          </RouterLink>

          <RouterLink
            :to="`/admin/courses/${course._id}/edit`"
            class="px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors"
          >
            Edit
          </RouterLink>

          <button
            class="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            @click="confirmDelete(course._id, course.title)"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
