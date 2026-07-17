<script setup lang="ts">
import { Pencil, Trash2, CheckCircle, Plus, X } from '@lucide/vue';
import { useQuizEditor } from '@/composables/admin/useQuizEditor';

const props = defineProps<{ lessonId: string }>();

const {
  questions, isLoading,
  newQuestion, editingQuestion, showAddForm,
  addQuestion, adding,
  saveQuestion, saving,
  confirmDeleteQuestion,
} = useQuizEditor(props.lessonId);

const optionLabels = ['A', 'B', 'C', 'D'];

function canSubmitNew() {
  return newQuestion.value.question.trim() &&
    newQuestion.value.options.every((o) => o.trim());
}

function canSubmitEdit() {
  return editingQuestion.value?.question.trim() &&
    editingQuestion.value?.options.every((o) => o.trim());
}
</script>

<template>
  <div class="ml-10 mt-1 mb-3 space-y-1.5">
    <div v-if="isLoading" class="text-xs text-gray-400 py-1">Memuat soal...</div>

    <template v-else>
      <!-- Kosong -->
      <p v-if="!questions?.length && !showAddForm"
        class="text-xs text-gray-400 italic py-1">
        Belum ada soal. Klik "+ Soal" untuk menambah.
      </p>

      <!-- ── Daftar Soal ── -->
      <div v-for="(q, qi) in questions" :key="q._id"
        class="group rounded-xl border border-gray-100 bg-white px-3 py-2.5">

        <!-- Mode edit -->
        <template v-if="editingQuestion?._id === q._id">
          <textarea v-model="editingQuestion.question" rows="2"
            placeholder="Pertanyaan..."
            class="w-full text-xs px-2 py-1.5 border border-indigo-300 rounded-lg focus:outline-none resize-none mb-2" />

          <div class="space-y-1 mb-2">
            <div v-for="(_, oi) in editingQuestion.options" :key="oi"
              class="flex items-center gap-2">
              <button
                class="w-5 h-5 shrink-0 rounded-full border-2 transition-colors flex items-center justify-center"
                :class="editingQuestion.correct_index === oi
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300 hover:border-green-400'"
                @click="editingQuestion.correct_index = oi">
                <span v-if="editingQuestion.correct_index === oi"
                  class="w-2 h-2 bg-white rounded-full" />
              </button>
              <span class="text-xs font-mono text-gray-400 w-4 shrink-0">{{ optionLabels[oi] }}</span>
              <input v-model="editingQuestion.options[oi]"
                :placeholder="`Opsi ${optionLabels[oi]}...`"
                class="flex-1 text-xs px-2 py-1 border rounded-lg focus:outline-none"
                :class="editingQuestion.correct_index === oi
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200'" />
            </div>
          </div>

          <div class="flex gap-2 justify-end">
            <button class="text-xs text-gray-400 px-2 py-1 rounded-lg hover:bg-gray-100"
              @click="editingQuestion = null">Batal</button>
            <button
              class="text-xs text-white px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40"
              :disabled="!canSubmitEdit() || saving"
              @click="saveQuestion()">
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </template>

        <!-- Mode baca -->
        <template v-else>
          <div class="flex items-start gap-2">
            <span class="text-xs font-mono text-gray-400 shrink-0 mt-0.5 w-5 text-right">
              {{ qi + 1 }}.
            </span>
            <p class="flex-1 text-xs font-medium text-gray-800 leading-relaxed">{{ q.question }}</p>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button class="p-1 text-gray-300 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
                @click="editingQuestion = { ...q, options: [...q.options] }">
                <Pencil class="w-3 h-3" />
              </button>
              <button class="p-1 text-gray-300 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                @click="confirmDeleteQuestion(q)">
                <Trash2 class="w-3 h-3" />
              </button>
            </div>
          </div>

          <div class="ml-7 mt-1.5 space-y-0.5">
            <div v-for="(opt, oi) in q.options" :key="oi"
              class="flex items-center gap-1.5 text-xs"
              :class="oi === q.correct_index ? 'text-green-600 font-semibold' : 'text-gray-500'">
              <span class="font-mono w-4 shrink-0">{{ optionLabels[oi] }}</span>
              <span>{{ opt }}</span>
              <CheckCircle v-if="oi === q.correct_index" class="w-3 h-3 shrink-0" />
            </div>
          </div>
        </template>
      </div>

      <!-- ── Form tambah soal ── -->
      <div v-if="showAddForm"
        class="rounded-xl border border-indigo-200 bg-indigo-50/30 px-3 py-2.5 space-y-2">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-semibold text-indigo-700">Soal baru</span>
          <button class="text-gray-400 hover:text-gray-600" @click="showAddForm = false">
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <textarea v-model="newQuestion.question" rows="2"
          placeholder="Tulis pertanyaan..."
          class="w-full text-xs px-2 py-1.5 border border-indigo-300 rounded-lg focus:outline-none resize-none bg-white" />

        <div class="space-y-1">
          <div v-for="(_, oi) in newQuestion.options" :key="oi"
            class="flex items-center gap-2">
            <button
              class="w-5 h-5 shrink-0 rounded-full border-2 transition-colors flex items-center justify-center"
              :class="newQuestion.correct_index === oi
                ? 'border-green-500 bg-green-500'
                : 'border-gray-300 hover:border-green-400'"
              @click="newQuestion.correct_index = oi">
              <span v-if="newQuestion.correct_index === oi"
                class="w-2 h-2 bg-white rounded-full" />
            </button>
            <span class="text-xs font-mono text-gray-400 w-4 shrink-0">{{ optionLabels[oi] }}</span>
            <input v-model="newQuestion.options[oi]"
              :placeholder="`Opsi ${optionLabels[oi]}...`"
              class="flex-1 text-xs px-2 py-1 border rounded-lg focus:outline-none bg-white"
              :class="newQuestion.correct_index === oi
                ? 'border-green-300 bg-green-50'
                : 'border-gray-200'" />
          </div>
        </div>

        <div class="flex gap-2 justify-end pt-1">
          <button class="text-xs text-gray-400 px-2 py-1 rounded-lg hover:bg-gray-100"
            @click="showAddForm = false">Batal</button>
          <button
            class="text-xs text-white px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40"
            :disabled="!canSubmitNew() || adding"
            @click="addQuestion()">
            {{ adding ? 'Menyimpan...' : 'Simpan Soal' }}
          </button>
        </div>
      </div>

      <!-- Tombol tambah -->
      <button v-if="!showAddForm"
        class="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
        @click="showAddForm = true">
        <Plus class="w-3.5 h-3.5" /> Tambah Soal
      </button>
    </template>
  </div>
</template>
