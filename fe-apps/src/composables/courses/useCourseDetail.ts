import { ref, computed, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getCourseDetail } from '@/api/courses';
import type { Lesson, Module } from '@/types/courses';

// Cari lesson pertama yang tidak terkunci di seluruh struktur modul
function findFirstLesson(modules: Module[]): Lesson | null {
  for (const mod of modules) {
    for (const chapter of mod.chapters) {
      for (const lesson of chapter.lessons) {
        if (!lesson.is_locked) return lesson;
      }
    }
  }
  return null;
}

// Cari lesson berdasarkan ID di seluruh struktur bersarang
function findLessonById(modules: Module[], lessonId: string | null): Lesson | null {
  if (!lessonId) return null;
  for (const mod of modules) {
    for (const chapter of mod.chapters) {
      const found = chapter.lessons.find((l) => l._id === lessonId);
      if (found) return found;
    }
  }
  return null;
}

// Cari lesson tepat setelah lesson saat ini (untuk navigasi otomatis)
function findNextLesson(modules: Module[], currentId: string): Lesson | null {
  const allLessons: Lesson[] = [];
  for (const mod of modules) {
    for (const chapter of mod.chapters) {
      allLessons.push(...chapter.lessons);
    }
  }
  const idx = allLessons.findIndex((l) => l._id === currentId);
  if (idx === -1 || idx === allLessons.length - 1) return null;
  return allLessons[idx + 1];
}

export function useCourseDetail(courseId: string) {
  const activeLessonId = ref<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseDetail(courseId).then((r) => r.data.data),
    staleTime: 0, // selalu refetch agar is_done/is_locked selalu fresh setelah update progress
  });

  // Pilih otomatis lesson pertama yang terbuka saat data selesai dimuat
  watch(
    data,
    (val) => {
      if (val && !activeLessonId.value) {
        const first = findFirstLesson(val.course.modules);
        if (first) activeLessonId.value = first._id;
      }
    },
    { immediate: true }
  );

  const activeLesson = computed(() =>
    data.value ? findLessonById(data.value.course.modules, activeLessonId.value) : null
  );

  const nextLesson = computed(() => {
    if (!data.value || !activeLessonId.value) return null;
    return findNextLesson(data.value.course.modules, activeLessonId.value);
  });

  function selectLesson(lessonId: string) {
    activeLessonId.value = lessonId;
  }

  const course = computed(() => data.value?.course ?? null);
  const isEnrolled = computed(() => data.value?.course.isEnrolled ?? true);

  return {
    courseData: data,
    isLoading,
    isError,
    refetch,
    activeLessonId,
    activeLesson,
    nextLesson,
    selectLesson,
    course,
    isEnrolled,
  };
}
