<script setup lang="ts">
import { useTopicList } from '@/composables/admin/useTopicList';
import { Tag, Plus, Pencil, Trash2, Check, X } from '@lucide/vue';

const {
  topics, isLoading,
  showAddForm, newTopic, creating, createTopic,
  editingTopic, startEdit, cancelEdit, saving, saveTopic,
  deleting, confirmDelete,
} = useTopicList();
</script>

<template>
  <div class="max-w-2xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-bold text-gray-900">Topics</h1>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
        @click="showAddForm = !showAddForm"
      >
        <Plus class="w-4 h-4" />
        Tambah Topik
      </button>
    </div>

    <!-- Form tambah topik -->
    <div v-if="showAddForm" class="bg-white rounded-2xl border border-indigo-200 shadow-sm p-5 mb-4">
      <p class="text-sm font-semibold text-gray-800 mb-3">Topik Baru</p>
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Slug</label>
          <input
            v-model="newTopic.slug"
            type="text"
            placeholder="web-dev"
            class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <p class="text-xs text-gray-400 mt-1">Huruf kecil, angka, dan tanda hubung</p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Nama</label>
          <input
            v-model="newTopic.name"
            type="text"
            placeholder="Web Development"
            class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>
      <div class="flex gap-2">
        <button
          :disabled="creating || !newTopic.slug || !newTopic.name"
          class="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          @click="createTopic()"
        >
          {{ creating ? 'Menyimpan...' : 'Simpan' }}
        </button>
        <button
          class="px-4 py-2 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
          @click="showAddForm = false; newTopic = { slug: '', name: '' }"
        >
          Batal
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-400">
      Memuat topik...
    </div>

    <!-- Kosong -->
    <div v-else-if="!topics?.length" class="bg-white rounded-2xl border border-gray-100 p-10 text-center">
      <Tag class="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <p class="text-sm text-gray-500">Belum ada topik. Buat topik pertama!</p>
    </div>

    <!-- Tabel topik -->
    <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <th class="text-left px-5 py-3">Slug</th>
            <th class="text-left px-5 py-3">Nama</th>
            <th class="w-24 px-5 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="topic in topics"
            :key="topic._id"
            class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
          >
            <!-- Mode tampil normal -->
            <template v-if="editingTopic?._id !== topic._id">
              <td class="px-5 py-3.5">
                <span class="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-mono px-2.5 py-1 rounded-lg">
                  <Tag class="w-3 h-3" />
                  {{ topic.slug }}
                </span>
              </td>
              <td class="px-5 py-3.5 font-medium text-gray-800">{{ topic.name }}</td>
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2 justify-end">
                  <button
                    class="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                    title="Edit"
                    @click="startEdit(topic)"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    :disabled="deleting"
                    class="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40"
                    title="Hapus"
                    @click="confirmDelete(topic)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </template>

            <!-- Mode edit inline -->
            <template v-else>
              <td class="px-4 py-2.5">
                <input
                  v-model="editingTopic!.slug"
                  class="w-full px-2.5 py-1.5 text-sm border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
                />
              </td>
              <td class="px-4 py-2.5">
                <input
                  v-model="editingTopic!.name"
                  class="w-full px-2.5 py-1.5 text-sm border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </td>
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-2 justify-end">
                  <button
                    :disabled="saving"
                    class="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-40"
                    title="Simpan"
                    @click="saveTopic()"
                  >
                    <Check class="w-4 h-4" />
                  </button>
                  <button
                    class="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Batal"
                    @click="cancelEdit()"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
