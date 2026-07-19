<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronDown, Pencil, Trash2, Plus, X, CalendarDays, Users, Wifi, MapPin, Blend } from '@lucide/vue';
import { useBootcampEditor } from '@/composables/admin/useBootcampEditor';

const route = useRoute();
const packageId = route.params.id as string;

const {
  pkg, isLoading,
  expandedBatches, toggleBatch,
  newBatch, showAddBatch, editingBatch,
  addBatch, addingBatch, saveBatch, savingBatch, confirmDeleteBatch,
  newSession, editingSession,
  addSession, addingSession, saveSession, savingSession, confirmDeleteSession,
} = useBootcampEditor(packageId);

// Satu batch saja yang bisa buka form tambah sesi sekaligus
const showAddSession = ref<string | null>(null);

function openAddSession(batchId: string) {
  showAddSession.value = batchId;
  if (!newSession.value[batchId]) {
    newSession.value[batchId] = { title: '', session_name: '', session_date: '', session_start_time: '', session_end_time: '' };
  }
}

async function submitAddSession(batchId: string) {
  if (!newSession.value[batchId]?.session_name) return;
  addSession(batchId);
  showAddSession.value = null;
}

const packageTypeIcon: Record<string, typeof Wifi> = {
  online: Wifi,
  offline: MapPin,
  hybrid: Blend,
};
const packageTypeLabel: Record<string, string> = {
  online: 'Online',
  offline: 'Offline',
  hybrid: 'Hybrid',
};

function formatDate(iso: string) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatPrice(n: number) {
  if (!n) return 'Gratis';
  return 'Rp ' + n.toLocaleString('id-ID');
}

function toInputDate(iso: string) {
  if (!iso) return '';
  return iso.slice(0, 10);
}
</script>

<template>
  <div class="max-w-4xl">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <RouterLink to="/admin/bootcamps" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
        ← Bootcamps
      </RouterLink>
      <span class="text-gray-300">/</span>
      <h1 class="flex-1 text-xl font-bold text-gray-900 truncate">{{ pkg?.title ?? '...' }}</h1>
      <RouterLink
        :to="`/admin/bootcamps/${packageId}/edit`"
        class="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Edit Info
      </RouterLink>
    </div>

    <!-- Mentor strip -->
    <div v-if="pkg?.mentors?.length" class="flex flex-wrap gap-4 mb-8 px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div
        v-for="m in pkg.mentors"
        :key="m.userId._id"
        class="flex items-center gap-2.5"
      >
        <img
          v-if="m.userId.avatar_url"
          :src="m.userId.avatar_url"
          class="w-8 h-8 rounded-full object-cover ring-2 ring-white"
        />
        <div
          v-else
          class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600"
        >
          {{ m.userId.name[0] }}
        </div>
        <div>
          <p class="text-xs font-semibold text-gray-800 leading-none">{{ m.userId.name }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ m.occupation }}</p>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="py-20 text-center text-sm text-gray-400">Memuat konten...</div>

    <div v-else class="space-y-4">

      <!-- ══ Batch Cards ══ -->
      <div
        v-for="(batch, bi) in pkg?.batches"
        :key="batch._id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <!-- ── Header Batch — seluruh area klik untuk expand ── -->
        <div
          class="flex items-start gap-4 px-5 py-4 cursor-pointer select-none transition-colors"
          :class="expandedBatches.has(batch._id) ? 'bg-indigo-50/50 border-b border-indigo-100' : 'hover:bg-gray-50/70'"
          @click="toggleBatch(batch._id)"
        >
          <!-- Nomor batch -->
          <span class="mt-0.5 w-7 h-7 flex items-center justify-center rounded-xl bg-indigo-600 text-white text-xs font-bold shrink-0">
            {{ bi + 1 }}
          </span>

          <div class="flex-1 min-w-0">
            <!-- Mode edit batch -->
            <template v-if="editingBatch?._id === batch._id">
              <div class="grid grid-cols-2 gap-2" @click.stop>
                <input v-model="editingBatch.title" placeholder="Judul batch *"
                  class="col-span-2 text-sm font-semibold px-2 py-1 border border-indigo-300 rounded-lg focus:outline-none" />
                <input v-model="editingBatch.sub_title" placeholder="Sub judul"
                  class="text-xs px-2 py-1 border border-indigo-200 rounded-lg focus:outline-none" />
                <select v-model="editingBatch.package_type"
                  class="text-xs px-2 py-1 border border-indigo-200 rounded-lg focus:outline-none bg-white">
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <input :value="toInputDate(editingBatch.started_at)" type="date"
                  class="text-xs px-2 py-1 border border-indigo-200 rounded-lg focus:outline-none"
                  @change="editingBatch.started_at = ($event.target as HTMLInputElement).value" />
                <input :value="toInputDate(editingBatch.ended_at)" type="date"
                  class="text-xs px-2 py-1 border border-indigo-200 rounded-lg focus:outline-none"
                  @change="editingBatch.ended_at = ($event.target as HTMLInputElement).value" />
                <input v-model.number="editingBatch.price" type="number" placeholder="Harga (Rp)"
                  class="text-xs px-2 py-1 border border-indigo-200 rounded-lg focus:outline-none" />
                <input v-model.number="editingBatch.strikethrough_price" type="number" placeholder="Harga coret"
                  class="text-xs px-2 py-1 border border-indigo-200 rounded-lg focus:outline-none" />
                <input v-model.number="editingBatch.quota_used_percentage" type="number" min="0" max="100" placeholder="% terisi"
                  class="text-xs px-2 py-1 border border-indigo-200 rounded-lg focus:outline-none" />
              </div>
              <div class="flex gap-2 mt-2" @click.stop>
                <button class="text-xs text-white bg-indigo-600 px-3 py-1 rounded-lg hover:bg-indigo-700 disabled:opacity-40"
                  :disabled="savingBatch" @click="saveBatch()">
                  {{ savingBatch ? 'Menyimpan...' : 'Simpan' }}
                </button>
                <button class="text-xs text-gray-400 px-2 py-1 rounded-lg hover:bg-gray-100"
                  @click="editingBatch = null">Batal</button>
              </div>
            </template>

            <!-- Mode baca batch -->
            <template v-else>
              <div class="flex items-center gap-2 flex-wrap">
                <p class="text-sm font-bold text-gray-900">{{ batch.title }}</p>
                <p v-if="batch.sub_title" class="text-xs text-gray-400">· {{ batch.sub_title }}</p>
                <span
                  class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                  :class="{
                    'bg-blue-50 text-blue-600': batch.package_type === 'online',
                    'bg-green-50 text-green-600': batch.package_type === 'offline',
                    'bg-purple-50 text-purple-600': batch.package_type === 'hybrid',
                  }"
                >
                  <component :is="packageTypeIcon[batch.package_type]" class="w-3 h-3" />
                  {{ packageTypeLabel[batch.package_type] }}
                </span>
              </div>

              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <CalendarDays class="w-3.5 h-3.5" />
                  {{ formatDate(batch.started_at) }} – {{ formatDate(batch.ended_at) }}
                </span>
                <span class="font-semibold text-gray-700">{{ formatPrice(batch.price) }}</span>
                <span v-if="batch.strikethrough_price" class="line-through text-gray-300">
                  {{ formatPrice(batch.strikethrough_price) }}
                </span>
                <span class="flex items-center gap-1">
                  <Users class="w-3.5 h-3.5" />
                  {{ batch.quota_used_percentage }}% terisi · {{ batch.sessions.length }} sesi
                </span>
              </div>

              <div class="mt-2 h-1 w-48 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full"
                  :class="{
                    'bg-emerald-400': batch.quota_used_percentage < 70,
                    'bg-amber-400': batch.quota_used_percentage >= 70 && batch.quota_used_percentage < 90,
                    'bg-red-400': batch.quota_used_percentage >= 90,
                  }"
                  :style="{ width: batch.quota_used_percentage + '%' }"
                />
              </div>
            </template>
          </div>

          <!-- Aksi + chevron -->
          <div class="flex items-center gap-1 shrink-0 mt-0.5" @click.stop>
            <template v-if="!editingBatch || editingBatch._id !== batch._id">
              <button class="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                @click="editingBatch = { ...batch, sessions: batch.sessions }">
                <Pencil class="w-3.5 h-3.5" />
              </button>
              <button class="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                @click="confirmDeleteBatch(batch)">
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </template>
            <ChevronDown
              class="w-4 h-4 text-gray-300 ml-1 transition-transform duration-200"
              :class="expandedBatches.has(batch._id) ? 'rotate-0' : '-rotate-90'"
            />
          </div>
        </div>

        <!-- ── Daftar Sesi ── -->
        <div v-if="expandedBatches.has(batch._id)">

          <div
            v-for="(session, si) in batch.sessions"
            :key="session._id"
            class="group border-t border-gray-50 first:border-t-0"
          >
            <!-- Mode edit session -->
            <div v-if="editingSession?._id === session._id" class="px-5 py-3 bg-indigo-50/30">
              <div class="grid grid-cols-2 gap-2 mb-2">
                <input v-model="editingSession.session_name" placeholder="Nama sesi"
                  class="col-span-2 text-xs px-2 py-1.5 border border-indigo-300 rounded-lg focus:outline-none bg-white" />
                <input v-model="editingSession.title" placeholder="Judul singkat"
                  class="text-xs px-2 py-1.5 border border-indigo-200 rounded-lg focus:outline-none bg-white" />
                <input :value="toInputDate(editingSession.session_date)" type="date"
                  class="text-xs px-2 py-1.5 border border-indigo-200 rounded-lg focus:outline-none bg-white"
                  @change="editingSession.session_date = ($event.target as HTMLInputElement).value" />
                <input v-model="editingSession.session_start_time" type="time"
                  class="text-xs px-2 py-1.5 border border-indigo-200 rounded-lg focus:outline-none bg-white" />
                <input v-model="editingSession.session_end_time" type="time"
                  class="text-xs px-2 py-1.5 border border-indigo-200 rounded-lg focus:outline-none bg-white" />
              </div>
              <div class="flex gap-2">
                <button class="text-xs text-white bg-indigo-600 px-3 py-1 rounded-lg hover:bg-indigo-700 disabled:opacity-40"
                  :disabled="savingSession" @click="saveSession()">
                  {{ savingSession ? '...' : 'Simpan' }}
                </button>
                <button class="text-xs text-gray-400 px-2 py-1 rounded-lg hover:bg-gray-100"
                  @click="editingSession = null">Batal</button>
              </div>
            </div>

            <!-- Mode baca session -->
            <div v-else class="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
              <!-- Nomor -->
              <span class="w-6 h-6 flex items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-500 shrink-0">
                {{ si + 1 }}
              </span>
              <!-- Konten -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 truncate">{{ session.session_name }}</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-xs text-gray-400">{{ formatDate(session.session_date) }}</span>
                  <span class="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 tabular-nums">
                    {{ session.session_start_time }} – {{ session.session_end_time }}
                  </span>
                </div>
              </div>
              <!-- Aksi -->
              <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button class="p-1.5 text-gray-300 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  @click="editingSession = { ...session }">
                  <Pencil class="w-3.5 h-3.5" />
                </button>
                <button class="p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  @click="confirmDeleteSession(session)">
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Form tambah session -->
          <div class="px-5 py-3 bg-gray-50/60">
            <!-- Tombol trigger -->
            <button
              v-if="showAddSession !== batch._id"
              class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 transition-colors"
              @click="openAddSession(batch._id)"
            >
              <Plus class="w-3.5 h-3.5" /> Tambah Sesi
            </button>

            <!-- Card form -->
            <div v-else class="border border-indigo-200 rounded-xl bg-white p-3 space-y-2">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-semibold text-indigo-700">Sesi Baru</span>
                <button class="text-gray-400 hover:text-gray-600" @click="showAddSession = null">
                  <X class="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                v-model="newSession[batch._id].session_name"
                placeholder="Nama sesi *"
                class="w-full text-xs px-2 py-1.5 border border-indigo-300 rounded-lg focus:outline-none"
              />
              <input
                v-model="newSession[batch._id].title"
                placeholder="Judul singkat (mis. Sesi 1)"
                class="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none"
              />
              <div class="grid grid-cols-3 gap-2">
                <input
                  :value="newSession[batch._id].session_date"
                  type="date"
                  class="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none"
                  @change="newSession[batch._id].session_date = ($event.target as HTMLInputElement).value"
                />
                <input
                  v-model="newSession[batch._id].session_start_time"
                  type="time"
                  placeholder="Mulai"
                  class="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none"
                />
                <input
                  v-model="newSession[batch._id].session_end_time"
                  type="time"
                  placeholder="Selesai"
                  class="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none"
                />
              </div>
              <div class="flex justify-end gap-2 pt-1">
                <button class="text-xs text-gray-400 px-2 py-1 rounded-lg hover:bg-gray-100"
                  @click="showAddSession = null">Batal</button>
                <button
                  class="text-xs text-white px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 font-semibold"
                  :disabled="!newSession[batch._id]?.session_name || addingSession"
                  @click="submitAddSession(batch._id)">
                  {{ addingSession ? 'Menyimpan...' : 'Simpan Sesi' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Form tambah batch ── -->
      <div v-if="showAddBatch" class="bg-white rounded-2xl border border-indigo-200 shadow-sm p-5 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm font-bold text-indigo-700">Batch Baru</span>
          <button class="text-gray-400 hover:text-gray-600" @click="showAddBatch = false">
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <input v-model="newBatch.title" placeholder="Judul batch *"
            class="col-span-2 text-sm px-3 py-2 border border-indigo-300 rounded-xl focus:outline-none bg-white" />
          <input v-model="newBatch.sub_title" placeholder="Sub judul"
            class="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none bg-white" />
          <select v-model="newBatch.package_type"
            class="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none bg-white">
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <div class="flex flex-col gap-0.5">
            <label class="text-xs text-gray-400">Mulai</label>
            <input v-model="newBatch.started_at" type="date"
              class="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none bg-white" />
          </div>
          <div class="flex flex-col gap-0.5">
            <label class="text-xs text-gray-400">Selesai</label>
            <input v-model="newBatch.ended_at" type="date"
              class="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none bg-white" />
          </div>
          <input v-model.number="newBatch.price" type="number" placeholder="Harga (Rp) *"
            class="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none bg-white" />
          <input v-model.number="newBatch.strikethrough_price" type="number" placeholder="Harga coret"
            class="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none bg-white" />
        </div>
        <div class="flex justify-end gap-2">
          <button class="text-xs text-gray-400 px-3 py-1.5 rounded-lg hover:bg-gray-100"
            @click="showAddBatch = false">Batal</button>
          <button
            class="text-xs text-white px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 font-semibold"
            :disabled="!newBatch.title.trim() || !newBatch.started_at || !newBatch.ended_at || addingBatch"
            @click="addBatch()">
            {{ addingBatch ? 'Menyimpan...' : 'Simpan Batch' }}
          </button>
        </div>
      </div>

      <!-- Tombol tambah batch -->
      <button
        v-if="!showAddBatch"
        class="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-colors"
        @click="showAddBatch = true"
      >
        <Plus class="w-4 h-4" /> Tambah Batch
      </button>
    </div>
  </div>
</template>
