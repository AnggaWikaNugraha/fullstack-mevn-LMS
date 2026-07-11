<script setup lang="ts">
import { PlayCircle } from '@lucide/vue';
import type { Course } from '@/types/courses';
import { formatRupiah } from '@/utils/format';

defineProps<{ course: Course }>();

const levelLabel: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const levelColor: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};
</script>

<template>
  <RouterLink :to="`/courses/${course._id}`" class="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
    <!-- Cover image -->
    <div class="relative aspect-video overflow-hidden bg-gray-100">
      <img
        :src="course.cover_url"
        :alt="course.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <span
        class="absolute top-2.5 left-2.5 text-xs font-semibold px-2.5 py-1 rounded-full"
        :class="course.isFree ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-white'"
      >
        {{ course.isFree ? 'Free' : 'Premium' }}
      </span>
    </div>

    <!-- Content -->
    <div class="p-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="levelColor[course.level]">
          {{ levelLabel[course.level] }}
        </span>
        <span class="text-xs text-gray-400">{{ course.topic_name }}</span>
      </div>

      <h3 class="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-3">
        {{ course.title }}
      </h3>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1 text-xs text-gray-500">
          <PlayCircle class="w-3.5 h-3.5" />
          <span>{{ course.video_amount }} videos</span>
        </div>
        <span v-if="course.isFree" class="text-xs font-semibold text-indigo-600">Gratis</span>
        <span v-else class="text-sm font-bold text-gray-900">{{ formatRupiah(course.price) }}</span>
      </div>
    </div>
  </RouterLink>
</template>
