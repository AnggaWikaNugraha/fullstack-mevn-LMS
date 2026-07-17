<script setup lang="ts">
import { type Component, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronDown, ChevronRight, ChevronsUpDown, Pencil, Trash2, ExternalLink, PlayCircle, CircleHelp, ClipboardList, Plus, X } from '@lucide/vue';
import { useCourseEditor } from '@/composables/admin/useCourseEditor';

const route = useRoute();
const courseId = route.params.id as string;

const {
  course, isLoading,
  expandedModules, expandedChapters, toggleModule, toggleChapter,
  expandAll, collapseAll,
  collapseModuleChapters, expandModuleChapters, allChaptersExpanded,
  newModuleTitle, newChapterTitle, newLesson,
  editingModule, editingChapter, editingLesson,
  addModule, saveModule, confirmDeleteModule,
  addChapter, saveChapter, confirmDeleteChapter,
  addLesson, saveLesson, confirmDeleteLesson,
} = useCourseEditor(courseId);

const typeIcon: Record<string, Component> = {
  video: PlayCircle,
  quiz: CircleHelp,
  task: ClipboardList,
};
const typeColor: Record<string, string> = {
  video: 'text-blue-400',
  quiz: 'text-purple-400',
  task: 'text-orange-400',
};

// Preview video
const previewVideoUrl = ref<string | null>(null);

function toEmbedUrl(url: string): string {
  const watchMatch = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`;
  const shortMatch = url.match(/youtu\.be\/([\w-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1`;
  return url;
}

function isYoutube(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}
</script>

<template>
  <div class="max-w-3xl bg-white rounded-xl shadow-sm p-6">
    <!-- Breadcrumb + global expand/collapse -->
    <div class="flex items-center gap-3 mb-8">
      <RouterLink to="/admin/courses" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
        ← Courses
      </RouterLink>
      <span class="text-gray-300">/</span>
      <h1 class="flex-1 text-xl font-bold text-gray-900 truncate">{{ course?.title ?? '...' }}</h1>
      <div class="flex items-center gap-1 shrink-0">
        <button
          class="px-2.5 py-1 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          @click="expandAll()">
          Buka Semua
        </button>
        <button
          class="px-2.5 py-1 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          @click="collapseAll()">
          Tutup Semua
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="py-20 text-center text-sm text-gray-400">Memuat konten...</div>

    <div v-else>

      <!-- ══ Daftar Modul ══ -->
      <div class="space-y-1">
        <template v-for="(mod, mi) in course?.modules" :key="mod._id">

          <!-- ── Baris Modul ── -->
          <div class="group flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <button class="shrink-0 text-gray-400 hover:text-gray-600" @click="toggleModule(mod._id)">
              <ChevronDown v-if="expandedModules.has(mod._id)" class="w-4 h-4" />
              <ChevronRight v-else class="w-4 h-4" />
            </button>
            <!-- Tombol collapse/expand semua bab dalam modul ini -->
            <button
              v-if="expandedModules.has(mod._id) && mod.chapters.length"
              class="shrink-0 text-gray-300 hover:text-gray-500 transition-colors"
              :title="allChaptersExpanded(mod._id) ? 'Tutup semua bab' : 'Buka semua bab'"
              @click="allChaptersExpanded(mod._id) ? collapseModuleChapters(mod._id) : expandModuleChapters(mod._id)"
            >
              <ChevronsUpDown class="w-3.5 h-3.5" />
            </button>

            <span class="w-5 shrink-0 text-xs font-mono text-gray-400 text-right">{{ mi + 1 }}</span>

            <template v-if="editingModule?.id === mod._id">
              <input
                v-model="editingModule.title" autofocus
                class="flex-1 text-sm font-semibold px-2 py-0.5 border border-indigo-300 rounded-lg focus:outline-none"
                @keyup.enter="saveModule()" @keyup.esc="editingModule = null"
              />
              <button class="text-xs text-indigo-600 font-medium px-2 shrink-0" @click="saveModule()">Simpan</button>
              <button class="text-xs text-gray-400 px-1 shrink-0" @click="editingModule = null">✕</button>
            </template>
            <template v-else>
              <span class="flex-1 text-sm font-semibold text-gray-800">{{ mod.title }}</span>
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button class="p-1 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
                  @click="editingModule = { id: mod._id, title: mod.title }">
                  <Pencil class="w-3.5 h-3.5" />
                </button>
                <button class="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                  @click="confirmDeleteModule(mod)">
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </template>
          </div>

          <!-- ── Isi Modul (bab) ── -->
          <div v-if="expandedModules.has(mod._id)"
            class="ml-9 pl-4 border-l-2 border-gray-100 pb-1 space-y-0.5">

            <template v-for="(ch, ci) in mod.chapters" :key="ch._id">

              <!-- Baris Bab -->
              <div class="group flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <button class="shrink-0 text-gray-300 hover:text-gray-500" @click="toggleChapter(ch._id)">
                  <ChevronDown v-if="expandedChapters.has(ch._id)" class="w-3.5 h-3.5" />
                  <ChevronRight v-else class="w-3.5 h-3.5" />
                </button>

                <span class="w-8 shrink-0 text-xs font-mono text-gray-300 text-right">
                  {{ mi + 1 }}.{{ ci + 1 }}
                </span>

                <template v-if="editingChapter?.id === ch._id">
                  <input
                    v-model="editingChapter.title" autofocus
                    class="flex-1 text-sm px-2 py-0.5 border border-indigo-300 rounded-lg focus:outline-none"
                    @keyup.enter="saveChapter()" @keyup.esc="editingChapter = null"
                  />
                  <button class="text-xs text-indigo-600 font-medium px-2 shrink-0" @click="saveChapter()">Simpan</button>
                  <button class="text-xs text-gray-400 px-1 shrink-0" @click="editingChapter = null">✕</button>
                </template>
                <template v-else>
                  <span class="flex-1 text-sm font-medium text-gray-700">{{ ch.title }}</span>
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button class="p-1 text-gray-300 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
                      @click="editingChapter = { id: ch._id, title: ch.title }">
                      <Pencil class="w-3 h-3" />
                    </button>
                    <button class="p-1 text-gray-300 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                      @click="confirmDeleteChapter(ch)">
                      <Trash2 class="w-3 h-3" />
                    </button>
                  </div>
                </template>
              </div>

              <!-- Isi Bab (lesson) -->
              <div v-if="expandedChapters.has(ch._id)"
                class="ml-8 pl-4 border-l-2 border-gray-100 pb-1 space-y-0.5">

                <!-- Baris Lesson -->
                <div v-for="(lesson, li) in ch.lessons" :key="lesson._id"
                  class="group flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">

                  <button
                    v-if="lesson.type === 'video' && lesson.video_url"
                    class="shrink-0 hover:scale-110 transition-transform"
                    @click="previewVideoUrl = lesson.video_url"
                  >
                    <component :is="typeIcon[lesson.type]" class="w-3.5 h-3.5" :class="typeColor[lesson.type]" />
                  </button>
                  <component v-else :is="typeIcon[lesson.type]"
                    class="shrink-0 w-3.5 h-3.5" :class="typeColor[lesson.type]" />

                  <span class="w-10 shrink-0 text-xs font-mono text-gray-200 text-right">
                    {{ mi + 1 }}.{{ ci + 1 }}.{{ li + 1 }}
                  </span>

                  <template v-if="editingLesson?._id === lesson._id">
                    <div class="flex-1 flex flex-col gap-1">
                      <input v-model="editingLesson.title" placeholder="Judul"
                        class="w-full text-xs px-2 py-0.5 border border-indigo-300 rounded-lg focus:outline-none"
                        @keyup.esc="editingLesson = null" />
                      <input v-if="editingLesson.type === 'video'" v-model="editingLesson.video_url"
                        placeholder="URL video"
                        class="w-full text-xs px-2 py-0.5 border border-indigo-200 rounded-lg focus:outline-none text-gray-500" />
                    </div>
                    <button class="text-xs text-indigo-600 font-medium px-2 shrink-0" @click="saveLesson()">Simpan</button>
                    <button class="text-xs text-gray-400 px-1 shrink-0" @click="editingLesson = null">✕</button>
                  </template>
                  <template v-else>
                    <span class="flex-1 text-xs text-gray-700">{{ lesson.title }}</span>
                    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <RouterLink v-if="lesson.type === 'quiz'" :to="`/admin/quiz/${lesson._id}`"
                        class="flex items-center gap-0.5 text-xs text-purple-600 hover:underline px-1.5 py-0.5 rounded hover:bg-purple-50 transition-colors">
                        Soal <ExternalLink class="w-2.5 h-2.5 ml-0.5" />
                      </RouterLink>
                      <button class="p-1 text-gray-300 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
                        @click="editingLesson = { ...lesson }">
                        <Pencil class="w-3 h-3" />
                      </button>
                      <button class="p-1 text-gray-300 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                        @click="confirmDeleteLesson(lesson)">
                        <Trash2 class="w-3 h-3" />
                      </button>
                    </div>
                  </template>
                </div>

                <!-- Form tambah lesson -->
                <div class="flex items-start gap-2 px-2 py-1.5">
                  <Plus class="w-3.5 h-3.5 text-gray-300 shrink-0 mt-1" />
                  <div class="flex-1 flex flex-col gap-1">
                    <input
                      v-model="(newLesson[ch._id] ??= { title: '', type: 'video', video_url: '' }).title"
                      placeholder="Lesson baru..."
                      class="w-full text-xs px-2 py-1 rounded-lg border border-transparent hover:border-gray-200 focus:border-indigo-300 focus:outline-none bg-transparent focus:bg-white transition-colors"
                      @keyup.enter="newLesson[ch._id]?.title && addLesson(ch._id)"
                    />
                    <input
                      v-if="newLesson[ch._id]?.type === 'video'"
                      v-model="(newLesson[ch._id] ??= { title: '', type: 'video', video_url: '' }).video_url"
                      placeholder="URL video..."
                      class="w-full text-xs px-2 py-1 rounded-lg border border-transparent hover:border-gray-200 focus:border-indigo-300 focus:outline-none bg-transparent focus:bg-white transition-colors text-gray-400"
                    />
                  </div>
                  <select
                    v-model="(newLesson[ch._id] ??= { title: '', type: 'video', video_url: '' }).type"
                    class="shrink-0 text-xs px-1.5 py-1 border border-gray-200 rounded-lg focus:outline-none bg-white text-gray-600">
                    <option value="video">Video</option>
                    <option value="quiz">Quiz</option>
                    <option value="task">Task</option>
                  </select>
                  <button
                    class="shrink-0 p-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-30 transition-colors"
                    :disabled="!newLesson[ch._id]?.title" @click="addLesson(ch._id)">
                    <Plus class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </template>

            <!-- Form tambah bab -->
            <div class="flex items-center gap-2 px-2 py-1.5 mt-0.5">
              <Plus class="w-3 h-3 text-gray-300 shrink-0" />
              <input
                v-model="newChapterTitle[mod._id]"
                placeholder="Bab baru..."
                class="flex-1 text-xs px-2 py-1 rounded-lg border border-transparent hover:border-gray-200 focus:border-indigo-300 focus:outline-none bg-transparent focus:bg-white transition-colors"
                @keyup.enter="newChapterTitle[mod._id] && addChapter(mod._id)"
              />
              <button
                class="shrink-0 text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-40 transition-colors"
                :disabled="!newChapterTitle[mod._id]" @click="addChapter(mod._id)">
                + Bab
              </button>
            </div>
          </div>

        </template>
      </div>

      <!-- Form tambah modul -->
      <div class="mt-6 pt-4 border-t border-dashed border-gray-200 flex items-center gap-2">
        <input
          v-model="newModuleTitle"
          placeholder="Tambah modul baru..."
          class="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          @keyup.enter="newModuleTitle && addModule()"
        />
        <button
          class="shrink-0 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors"
          :disabled="!newModuleTitle" @click="addModule()">
          + Modul
        </button>
      </div>
    </div>
  </div>

  <!-- Modal preview video -->
  <Teleport to="body">
    <div
      v-if="previewVideoUrl"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click.self="previewVideoUrl = null"
    >
      <div class="relative w-full max-w-2xl mx-4 rounded-2xl overflow-hidden bg-black shadow-2xl">
        <button
          class="absolute top-3 right-3 z-10 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/90 transition-colors"
          @click="previewVideoUrl = null"
        >
          <X class="w-4 h-4" />
        </button>
        <div class="aspect-video">
          <iframe
            v-if="isYoutube(previewVideoUrl)"
            :src="toEmbedUrl(previewVideoUrl)"
            class="w-full h-full"
            allow="autoplay; fullscreen"
            allowfullscreen
          />
          <video
            v-else
            :src="previewVideoUrl"
            class="w-full h-full"
            controls
            autoplay
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
