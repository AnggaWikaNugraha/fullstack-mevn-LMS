<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCourseForm } from '@/composables/admin/useCourseForm';
import type { CoursePayload } from '@/api/admin/courses';

const route = useRoute();
const router = useRouter();

const courseId = computed(() => route.params.id as string | undefined);
const isEdit = computed(() => !!courseId.value);

const form = ref<CoursePayload>({
  title: '',
  description: '',
  cover_url: '',
  topic: '',
  topic_name: '',
  level: 'beginner',
  isFree: false,
  price: 0,
});

const {
  courseData,
  loadingCourse,
  createCourse,
  updateCourse,
  creating,
  updating,
} = useCourseForm(courseId.value);

watch(courseData, (val) => {
  if (val) {
    form.value = {
      title: val.title,
      description: val.description,
      cover_url: val.cover_url,
      topic: val.topic,
      topic_name: val.topic_name,
      level: val.level,
      isFree: val.isFree,
      price: val.price,
    };
  }
}, { immediate: true });

const isPending = computed(() => creating.value || updating.value);

function handleSubmit() {
  if (isEdit.value) {
    updateCourse(form.value, { onSuccess: () => router.push('/admin/courses') });
  } else {
    createCourse(form.value, { onSuccess: () => router.push('/admin/courses') });
  }
}
</script>

<template>
  <div class="max-w-2xl">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <RouterLink to="/admin/courses" class="text-sm text-gray-400 hover:text-gray-700">← Courses</RouterLink>
      <span class="text-gray-300">/</span>
      <h1 class="text-xl font-bold text-gray-900">{{ isEdit ? 'Edit Course' : 'Tambah Course' }}</h1>
    </div>

    <!-- Loading pre-fill -->
    <div v-if="isEdit && loadingCourse" class="bg-white rounded-2xl border border-gray-100 p-8 text-center text-sm text-gray-400">
      Memuat data...
    </div>

    <!-- Form -->
    <form v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5" @submit.prevent="handleSubmit">

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Judul Course</label>
        <input
          v-model="form.title"
          type="text"
          required
          placeholder="Contoh: Vue 3 untuk Pemula"
          class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
        <textarea
          v-model="form.description"
          required
          rows="4"
          placeholder="Deskripsi singkat course..."
          class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">URL Cover</label>
        <input
          v-model="form.cover_url"
          type="url"
          required
          placeholder="https://..."
          class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div v-if="form.cover_url" class="mt-2 rounded-xl overflow-hidden h-32 bg-gray-100">
          <img :src="form.cover_url" alt="preview" class="w-full h-full object-cover" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Topic (slug)</label>
          <input
            v-model="form.topic"
            type="text"
            required
            placeholder="web-dev"
            class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Topic Name</label>
          <input
            v-model="form.topic_name"
            type="text"
            required
            placeholder="Web Development"
            class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Level</label>
        <select
          v-model="form.level"
          class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div class="flex items-center gap-3">
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input v-model="form.isFree" type="checkbox" class="w-4 h-4 rounded accent-indigo-600" />
          <span class="text-sm font-medium text-gray-700">Gratis</span>
        </label>
      </div>

      <div v-if="!form.isFree">
        <label class="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
        <input
          v-model.number="form.price"
          type="number"
          min="0"
          step="1000"
          placeholder="150000"
          class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          :disabled="isPending"
          class="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {{ isPending ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Course' }}
        </button>
        <RouterLink
          to="/admin/courses"
          class="px-6 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Batal
        </RouterLink>
      </div>
    </form>
  </div>
</template>
