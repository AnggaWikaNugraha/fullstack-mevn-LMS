<script setup lang="ts">
import { useRoute } from 'vue-router';
import { UserCheck, UserX } from '@lucide/vue';
import { useBootcampForm } from '@/composables/admin/useBootcampForm';

const route = useRoute();
const packageId = route.params.id as string | undefined;
const isEdit = !!packageId;

const {
  form, saving, save,
  availableMentors,
  toggleMentor, isMentorSelected, updateOccupation, getMentorPayload,
} = useBootcampForm(isEdit ? packageId : undefined);
</script>

<template>
  <div class="max-w-2xl">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <RouterLink to="/admin/bootcamps" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
        ← Bootcamps
      </RouterLink>
      <span class="text-gray-300">/</span>
      <h1 class="text-xl font-bold text-gray-900">{{ isEdit ? 'Edit Bootcamp' : 'Tambah Bootcamp' }}</h1>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <!-- Judul -->
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Judul</label>
        <input
          v-model="form.title"
          placeholder="Nama paket bootcamp..."
          class="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400"
        />
      </div>

      <!-- Deskripsi -->
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Deskripsi</label>
        <textarea
          v-model="form.description"
          rows="4"
          placeholder="Deskripsi bootcamp..."
          class="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 resize-none"
        />
      </div>

      <!-- URL Gambar -->
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1.5">URL Gambar</label>
        <input
          v-model="form.image_url"
          placeholder="https://..."
          class="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400"
        />
        <img
          v-if="form.image_url"
          :src="form.image_url"
          class="mt-2 h-28 w-full object-cover rounded-xl border border-gray-100"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        />
      </div>

      <!-- Status -->
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
        <select
          v-model="form.status"
          class="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 bg-white"
        >
          <option value="coming_soon">Coming Soon</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <!-- Mentor Picker -->
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-2">Mentor</label>

        <p v-if="!availableMentors?.length" class="text-xs text-gray-400 italic">
          Belum ada user dengan role mentor.
        </p>

        <div class="space-y-2">
          <div
            v-for="mentor in availableMentors"
            :key="mentor._id"
            class="border rounded-xl transition-colors"
            :class="isMentorSelected(mentor._id)
              ? 'border-indigo-300 bg-indigo-50/40'
              : 'border-gray-100 bg-gray-50/30'"
          >
            <!-- Baris toggle mentor -->
            <button
              type="button"
              class="w-full flex items-center gap-3 px-3 py-2.5 text-left"
              @click="toggleMentor(mentor._id)"
            >
              <img
                v-if="mentor.avatar_url"
                :src="mentor.avatar_url"
                class="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div
                v-else
                class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0"
              >
                {{ mentor.name[0] }}
              </div>
              <span class="flex-1 text-sm font-medium text-gray-800">{{ mentor.name }}</span>
              <component
                :is="isMentorSelected(mentor._id) ? UserCheck : UserX"
                class="w-4 h-4 shrink-0 transition-colors"
                :class="isMentorSelected(mentor._id) ? 'text-indigo-500' : 'text-gray-300'"
              />
            </button>

            <!-- Input occupation — hanya tampil jika dipilih -->
            <div v-if="isMentorSelected(mentor._id)" class="px-3 pb-3">
              <input
                :value="getMentorPayload(mentor._id)?.occupation"
                placeholder="Posisi / jabatan (mis. Senior Engineer @ Tokopedia)..."
                class="w-full text-xs px-2 py-1.5 border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-400 bg-white"
                @input="updateOccupation(mentor._id, ($event.target as HTMLInputElement).value)"
              />
            </div>
          </div>
        </div>

        <p v-if="form.mentors.length" class="mt-2 text-xs text-gray-400">
          {{ form.mentors.length }} mentor dipilih
        </p>
      </div>

      <!-- Tombol simpan -->
      <div class="flex justify-end gap-3 pt-2">
        <RouterLink
          to="/admin/bootcamps"
          class="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Batal
        </RouterLink>
        <button
          class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors"
          :disabled="!form.title.trim() || saving"
          @click="save()"
        >
          {{ saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Bootcamp' }}
        </button>
      </div>
    </div>
  </div>
</template>
