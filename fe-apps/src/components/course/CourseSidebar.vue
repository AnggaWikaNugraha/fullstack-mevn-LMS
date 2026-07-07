<script setup lang="ts">
import { ref, computed } from 'vue';
import type { CourseDetail } from '@/types/courses';

const props = defineProps<{
  course: CourseDetail;
  activeLessonId: string | null;
}>();

const emit = defineEmits<{ 'select-lesson': [lessonId: string] }>();

// Track which modules are expanded — all open by default
const openModules = ref(new Set(props.course.modules.map((m) => m._id)));

function toggleModule(moduleId: string) {
  if (openModules.value.has(moduleId)) {
    openModules.value.delete(moduleId);
  } else {
    openModules.value.add(moduleId);
  }
}

const completedCount = computed(() => {
  let count = 0;
  for (const mod of props.course.modules) {
    for (const chap of mod.chapters) {
      for (const lesson of chap.lessons) {
        if (lesson.is_done) count++;
      }
    }
  }
  return count;
});

const totalCount = computed(() => {
  let count = 0;
  for (const mod of props.course.modules) {
    for (const chap of mod.chapters) {
      count += chap.lessons.length;
    }
  }
  return count;
});

const progressPercent = computed(() =>
  totalCount.value > 0 ? Math.round((completedCount.value / totalCount.value) * 100) : 0
);

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  return `${m} menit`;
}
</script>

<template>
  <!-- Mobile: tinggi otomatis, max 70vh agar scrollable. Desktop: h-full mengisi kolom -->
  <aside class="flex flex-col max-h-[70vh] lg:max-h-none lg:h-full bg-white">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
        {{ course.title }}
      </h2>

      <!-- Progress bar -->
      <div class="mt-3">
        <div class="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{{ completedCount }}/{{ totalCount }} lesson</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-1.5">
          <div
            class="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Module list — scrollable -->
    <div class="flex-1 overflow-y-auto">
      <div v-for="module in course.modules" :key="module._id">
        <!-- Module header (collapsible) -->
        <button
          class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
          @click="toggleModule(module._id)"
        >
          <span class="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            {{ module.title }}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-gray-400 transition-transform"
            :class="{ 'rotate-180': openModules.has(module._id) }"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Chapters & Lessons -->
        <div v-show="openModules.has(module._id)">
          <div v-for="chapter in module.chapters" :key="chapter._id">
            <!-- Chapter label -->
            <div class="px-4 py-2 bg-white border-b border-gray-100">
              <p class="text-xs font-medium text-gray-500">{{ chapter.title }}</p>
            </div>

            <!-- Lesson items -->
            <button
              v-for="lesson in chapter.lessons"
              :key="lesson._id"
              class="w-full flex items-start gap-3 px-4 py-3 border-b border-gray-50 transition-colors text-left"
              :class="[
                lesson._id === activeLessonId
                  ? 'bg-indigo-50 border-l-2 border-l-indigo-600'
                  : 'hover:bg-gray-50',
                lesson.is_locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ]"
              :disabled="lesson.is_locked"
              @click="!lesson.is_locked && emit('select-lesson', lesson._id)"
            >
              <!-- Status icon -->
              <div class="mt-0.5 shrink-0">
                <!-- Completed -->
                <svg v-if="lesson.is_done" xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd" />
                </svg>
                <!-- Locked -->
                <svg v-else-if="lesson.is_locked" xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <!-- Available / active -->
                <svg v-else xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  :class="lesson._id === activeLessonId ? 'text-indigo-600' : 'text-gray-400'"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-gray-800 leading-snug line-clamp-2">
                  {{ lesson.title }}
                </p>
                <p v-if="lesson.type === 'video' && lesson.duration" class="text-xs text-gray-400 mt-0.5">
                  {{ formatDuration(lesson.duration) }}
                </p>
                <span v-if="lesson.type === 'quiz'" class="text-xs text-amber-600 font-medium">Quiz</span>
                <span v-if="lesson.type === 'task'" class="text-xs text-blue-600 font-medium">Task</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
