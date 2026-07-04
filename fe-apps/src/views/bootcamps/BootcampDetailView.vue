<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useBootcampDetail } from '@/composables/bootcamps/useBootcampDetail';
import { useAuthStore } from '@/stores/authStore';
import { Users, MapPin, Calendar, Clock } from '@lucide/vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const id = route.params.id as string;
const {
  bootcamp,
  batches,
  selectedBatch,
  selectedSessions,
  selectedBatchIndex,
  setSelectedBatch,
  formatRupiah,
  formatSessionDate,
  isLoading,
  isError,
} = useBootcampDetail(id);

const packageTypeLabel: Record<string, string> = {
  online: 'Online',
  offline: 'Offline',
  hybrid: 'Hybrid',
};

const statusConfig = {
  open: { label: 'Buka Pendaftaran', class: 'bg-green-100 text-green-700' },
  coming_soon: { label: 'Segera Hadir', class: 'bg-amber-100 text-amber-700' },
  closed: { label: 'Pendaftaran Ditutup', class: 'bg-gray-100 text-gray-500' },
};

// Tombol daftar — cek login, redirect jika belum
function handleRegister() {
  if (!authStore.user) {
    localStorage.setItem('redirect_after_login', route.fullPath);
    router.push('/auth/login');
    return;
  }
  // Phase 4: buka modal checkout
}

const isRegisterDisabled = (status: string, quota: number) =>
  status !== 'open' || quota >= 100;
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading skeleton -->
    <div v-if="isLoading" class="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div class="h-64 bg-gray-200 rounded-2xl animate-pulse" />
      <div class="space-y-3">
        <div class="h-6 w-2/3 bg-gray-200 rounded animate-pulse" />
        <div class="h-4 w-full bg-gray-200 rounded animate-pulse" />
        <div class="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="isError || !bootcamp" class="max-w-5xl mx-auto px-4 py-20 text-center">
      <p class="text-gray-400 mb-4">Bootcamp tidak ditemukan.</p>
      <RouterLink to="/" class="text-indigo-600 hover:underline text-sm">← Kembali ke Beranda</RouterLink>
    </div>

    <template v-else>
      <!-- Header cover -->
      <div class="relative h-56 sm:h-72 bg-gray-900 overflow-hidden">
        <img
          :src="bootcamp.image_url"
          :alt="bootcamp.title"
          class="w-full h-full object-cover opacity-50"
        />
        <div class="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
          <span
            class="inline-block self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
            :class="statusConfig[bootcamp.status].class"
          >
            {{ statusConfig[bootcamp.status].label }}
          </span>
          <h1 class="text-2xl sm:text-3xl font-bold text-white leading-tight max-w-2xl">
            {{ bootcamp.title }}
          </h1>
        </div>
      </div>

      <!-- Konten utama -->
      <div class="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Kiri: deskripsi + mentor + batch + sesi -->
        <div class="lg:col-span-2 space-y-8">

          <!-- Deskripsi -->
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3">Tentang Program</h2>
            <p class="text-gray-600 leading-relaxed">{{ bootcamp.description }}</p>
          </section>

          <!-- Mentor -->
          <section v-if="bootcamp.mentors.length">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Mentor</h2>
            <div class="flex flex-wrap gap-4">
              <div
                v-for="mentor in bootcamp.mentors"
                :key="mentor.name"
                class="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 flex-1 min-w-[220px]"
              >
                <img
                  :src="mentor.image_url"
                  :alt="mentor.name"
                  class="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <p class="font-semibold text-gray-900 text-sm">{{ mentor.name }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ mentor.occupation }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Batch tabs -->
          <section v-if="batches.length">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Jadwal Batch</h2>

            <!-- Tab pilihan batch -->
            <div class="flex gap-2 flex-wrap mb-5">
              <button
                v-for="(batch, i) in batches"
                :key="batch._id"
                class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                :class="selectedBatchIndex === i
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                @click="setSelectedBatch(i)"
              >
                {{ batch.title }}
              </button>
            </div>

            <!-- Info batch terpilih -->
            <div v-if="selectedBatch" class="bg-white rounded-xl border border-gray-100 p-5">
              <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-5">
                <div class="flex items-center gap-1.5">
                  <Calendar class="w-4 h-4 text-indigo-500" />
                  <span>
                    {{ new Date(selectedBatch.started_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                    –
                    {{ new Date(selectedBatch.ended_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                  </span>
                </div>
                <div class="flex items-center gap-1.5">
                  <MapPin class="w-4 h-4 text-indigo-500" />
                  <span>{{ packageTypeLabel[selectedBatch.package_type] }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Users class="w-4 h-4 text-indigo-500" />
                  <span>Kuota terisi {{ selectedBatch.quota_used_percentage }}%</span>
                </div>
              </div>

              <!-- Progress bar kuota -->
              <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-5">
                <div
                  class="h-full bg-indigo-500 rounded-full transition-all"
                  :style="{ width: `${selectedBatch.quota_used_percentage}%` }"
                />
              </div>

              <!-- Daftar sesi -->
              <div v-if="selectedSessions.length" class="space-y-2">
                <h3 class="text-sm font-semibold text-gray-700 mb-3">Jadwal Sesi</h3>
                <div
                  v-for="session in selectedSessions"
                  :key="session._id"
                  class="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0"
                >
                  <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Clock class="w-4 h-4 text-indigo-600" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">
                      {{ session.title }} — {{ session.session_name }}
                    </p>
                    <p class="text-xs text-gray-400 mt-0.5">
                      {{ formatSessionDate(session.session_date) }}
                      · {{ session.session_start_time }}–{{ session.session_end_time }}
                    </p>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-gray-400 text-center py-4">
                Jadwal sesi belum tersedia.
              </p>
            </div>
          </section>

          <div v-else class="text-gray-400 text-sm">
            Belum ada jadwal batch tersedia untuk program ini.
          </div>
        </div>

        <!-- Kanan: CTA card (sticky di desktop) -->
        <div class="lg:col-span-1">
          <div class="sticky top-20 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div v-if="selectedBatch">
              <!-- Harga -->
              <div>
                <div v-if="selectedBatch.strikethrough_price > 0" class="text-sm text-gray-400 line-through mb-0.5">
                  {{ formatRupiah(selectedBatch.strikethrough_price) }}
                </div>
                <div class="text-2xl font-bold text-gray-900">
                  {{ formatRupiah(selectedBatch.price) }}
                </div>
                <p class="text-xs text-gray-400 mt-1">{{ selectedBatch.title }} · {{ packageTypeLabel[selectedBatch.package_type] }}</p>
              </div>

              <!-- Bar kuota -->
              <div>
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Kuota</span>
                  <span>{{ selectedBatch.quota_used_percentage }}% terisi</span>
                </div>
                <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all"
                    :class="selectedBatch.quota_used_percentage >= 80 ? 'bg-red-400' : 'bg-indigo-500'"
                    :style="{ width: `${selectedBatch.quota_used_percentage}%` }"
                  />
                </div>
              </div>

              <!-- Tombol daftar -->
              <button
                class="w-full py-3 rounded-xl font-semibold text-sm transition-colors mt-2"
                :class="isRegisterDisabled(bootcamp.status, selectedBatch.quota_used_percentage)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'"
                :disabled="isRegisterDisabled(bootcamp.status, selectedBatch.quota_used_percentage)"
                @click="handleRegister"
              >
                <template v-if="bootcamp.status === 'coming_soon'">Segera Hadir</template>
                <template v-else-if="bootcamp.status === 'closed'">Pendaftaran Ditutup</template>
                <template v-else-if="selectedBatch.quota_used_percentage >= 100">Kuota Penuh</template>
                <template v-else>Daftar Sekarang</template>
              </button>

              <p class="text-xs text-gray-400 text-center">
                Checkout & pembayaran tersedia segera
              </p>
            </div>
            <div v-else class="text-sm text-gray-400 text-center py-4">
              Belum ada batch tersedia.
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
