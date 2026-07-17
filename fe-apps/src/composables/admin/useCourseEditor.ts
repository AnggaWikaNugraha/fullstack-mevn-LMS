import { ref, watch } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import {
  adminCreateModule, adminUpdateModule, adminDeleteModule,
  adminCreateChapter, adminUpdateChapter, adminDeleteChapter,
  adminCreateLesson, adminUpdateLesson, adminDeleteLesson,
  type AdminModule, type AdminChapter, type AdminLesson,
} from '@/api/admin/courses';
import { useCourseContent } from './useCourseContent';

type NewLessonState = { title: string; type: 'video' | 'quiz' | 'task'; video_url: string };

export function useCourseEditor(courseId: string) {
  const { course, isLoading, invalidate } = useCourseContent(courseId);

  // Expand accordion — buat Set baru agar Vue melacak perubahan
  const expandedModules = ref<Set<string>>(new Set());
  const expandedChapters = ref<Set<string>>(new Set());

  // Auto-expand semua modul & bab saat data pertama kali load
  watch(course, (val) => {
    if (!val) return;
    const mods = new Set(expandedModules.value);
    const chaps = new Set(expandedChapters.value);
    val.modules.forEach((m) => {
      mods.add(m._id);
      m.chapters.forEach((c) => chaps.add(c._id));
    });
    expandedModules.value = mods;
    expandedChapters.value = chaps;
  }, { immediate: true });

  // Collapse / expand semua sekaligus
  function expandAll() {
    const mods = new Set<string>();
    const chaps = new Set<string>();
    course.value?.modules.forEach((m) => {
      mods.add(m._id);
      m.chapters.forEach((c) => chaps.add(c._id));
    });
    expandedModules.value = mods;
    expandedChapters.value = chaps;
  }

  function collapseAll() {
    expandedModules.value = new Set();
    expandedChapters.value = new Set();
  }

  // Collapse / expand semua bab dalam satu modul
  function collapseModuleChapters(moduleId: string) {
    const mod = course.value?.modules.find((m) => m._id === moduleId);
    if (!mod) return;
    const s = new Set(expandedChapters.value);
    mod.chapters.forEach((c) => s.delete(c._id));
    expandedChapters.value = s;
  }

  function expandModuleChapters(moduleId: string) {
    const mod = course.value?.modules.find((m) => m._id === moduleId);
    if (!mod) return;
    const s = new Set(expandedChapters.value);
    mod.chapters.forEach((c) => s.add(c._id));
    expandedChapters.value = s;
  }

  // Apakah semua bab dalam modul sudah expanded
  function allChaptersExpanded(moduleId: string): boolean {
    const mod = course.value?.modules.find((m) => m._id === moduleId);
    return !!mod && mod.chapters.every((c) => expandedChapters.value.has(c._id));
  }

  const toggleModule = (id: string) => {
    const s = new Set(expandedModules.value);
    s.has(id) ? s.delete(id) : s.add(id);
    expandedModules.value = s;
  };
  const toggleChapter = (id: string) => {
    const s = new Set(expandedChapters.value);
    s.has(id) ? s.delete(id) : s.add(id);
    expandedChapters.value = s;
  };

  // Form inline state
  const newModuleTitle = ref('');
  const newChapterTitle = ref<Record<string, string>>({});
  const newLesson = ref<Record<string, NewLessonState>>({});
  const editingModule = ref<{ id: string; title: string } | null>(null);
  const editingChapter = ref<{ id: string; title: string } | null>(null);
  const editingLesson = ref<AdminLesson | null>(null);

  // Module mutations
  const { mutate: addModule } = useMutation({
    mutationFn: () => adminCreateModule(courseId, {
      title: newModuleTitle.value,
      order: (course.value?.modules.length ?? 0) + 1,
    }),
    onSuccess: () => { invalidate(); newModuleTitle.value = ''; },
  });

  const { mutate: saveModule } = useMutation({
    mutationFn: () => adminUpdateModule(editingModule.value!.id, { title: editingModule.value!.title }),
    onSuccess: () => { invalidate(); editingModule.value = null; },
  });

  const { mutate: removeModule } = useMutation({
    mutationFn: (id: string) => adminDeleteModule(id),
    onSuccess: invalidate,
  });

  // Chapter mutations
  const { mutate: addChapter } = useMutation({
    mutationFn: (moduleId: string) => adminCreateChapter(moduleId, {
      title: newChapterTitle.value[moduleId] ?? '',
      order: (course.value?.modules.find((m) => m._id === moduleId)?.chapters.length ?? 0) + 1,
    }),
    onSuccess: (_d, moduleId) => { invalidate(); newChapterTitle.value[moduleId] = ''; },
  });

  const { mutate: saveChapter } = useMutation({
    mutationFn: () => adminUpdateChapter(editingChapter.value!.id, { title: editingChapter.value!.title }),
    onSuccess: () => { invalidate(); editingChapter.value = null; },
  });

  const { mutate: removeChapter } = useMutation({
    mutationFn: (id: string) => adminDeleteChapter(id),
    onSuccess: invalidate,
  });

  // Lesson mutations
  const { mutate: addLesson } = useMutation({
    mutationFn: (chapterId: string) => {
      const l = newLesson.value[chapterId];
      const chapter = course.value?.modules.flatMap((m) => m.chapters).find((c) => c._id === chapterId);
      return adminCreateLesson(chapterId, {
        title: l.title,
        type: l.type,
        video_url: l.type === 'video' ? l.video_url || null : null,
        order: (chapter?.lessons.length ?? 0) + 1,
      });
    },
    onSuccess: (_d, chapterId) => {
      invalidate();
      newLesson.value[chapterId] = { title: '', type: 'video', video_url: '' };
    },
  });

  const { mutate: saveLesson } = useMutation({
    mutationFn: () => adminUpdateLesson(editingLesson.value!._id, {
      title: editingLesson.value!.title,
      type: editingLesson.value!.type,
      video_url: editingLesson.value!.type === 'video' ? editingLesson.value!.video_url : null,
      duration: editingLesson.value!.duration,
      is_locked: editingLesson.value!.is_locked,
    }),
    onSuccess: () => { invalidate(); editingLesson.value = null; },
  });

  const { mutate: removeLesson } = useMutation({
    mutationFn: (id: string) => adminDeleteLesson(id),
    onSuccess: invalidate,
  });

  // Confirm delete helpers
  function confirmDeleteModule(mod: AdminModule) {
    if (confirm(`Hapus modul "${mod.title}" beserta semua isinya?`)) removeModule(mod._id);
  }
  function confirmDeleteChapter(ch: AdminChapter) {
    if (confirm(`Hapus bab "${ch.title}" beserta semua lessonnya?`)) removeChapter(ch._id);
  }
  function confirmDeleteLesson(l: AdminLesson) {
    if (confirm(`Hapus lesson "${l.title}"?`)) removeLesson(l._id);
  }

  return {
    course, isLoading,
    expandedModules, expandedChapters, toggleModule, toggleChapter,
    expandAll, collapseAll,
    collapseModuleChapters, expandModuleChapters, allChaptersExpanded,
    newModuleTitle, newChapterTitle, newLesson,
    editingModule, editingChapter, editingLesson,
    addModule, saveModule, confirmDeleteModule,
    addChapter, saveChapter, confirmDeleteChapter,
    addLesson, saveLesson, confirmDeleteLesson,
  };
}
