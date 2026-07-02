<script setup lang="ts">
import CourseCard from '@/components/course/CourseCard.vue';
import { useCourses } from '@/composables/courses/useCourses';

const { filteredCourses, topics, selectedTopic, selectTopic, isLoadingCourses, isLoadingTopics } = useCourses();
</script>

<template>
  <section class="py-12 px-4 max-w-7xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Explore Courses</h2>

    <!-- Topic filter pills -->
    <div class="flex flex-wrap gap-2 mb-8">
      <!-- Skeleton pills -->
      <template v-if="isLoadingTopics">
        <div v-for="i in 5" :key="i" class="h-8 w-24 rounded-full bg-gray-200 animate-pulse" />
      </template>

      <template v-else>
        <!-- "All" pill -->
        <button
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          :class="!selectedTopic ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="selectTopic('')"
        >
          All
        </button>

        <button
          v-for="t in topics"
          :key="t.topic"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          :class="selectedTopic === t.topic ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="selectTopic(t.topic)"
        >
          {{ t.topic_name }}
        </button>
      </template>
    </div>

    <!-- Course grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      <!-- Skeleton cards -->
      <template v-if="isLoadingCourses">
        <div v-for="i in 8" :key="i" class="rounded-2xl overflow-hidden border border-gray-100">
          <div class="aspect-video bg-gray-200 animate-pulse" />
          <div class="p-4 space-y-2">
            <div class="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
            <div class="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div class="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </template>

      <template v-else>
        <p v-if="filteredCourses.length === 0" class="col-span-full text-center text-gray-400 py-12">
          No courses found for this topic.
        </p>
        <CourseCard v-for="course in filteredCourses" :key="course._id" :course="course" />
      </template>
    </div>
  </section>
</template>
