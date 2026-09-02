<script setup lang="ts">
import { CalendarDays, Clock, Layers, Wifi, MapPin, Blend, Video } from '@lucide/vue';
import {
  useMyBootcamps,
  bootcampStatusBadge,
  bootcampStatusLabel,
  packageTypeLabel,
  formatSessionDate,
} from '@/composables/bootcamps/useMyBootcamps';

const { bootcamps, active, finished, isLoading, isError, liveSessionOf } = useMyBootcamps();

const packageTypeIcon: Record<string, typeof Wifi> = {
  online: Wifi,
  offline: MapPin,
  hybrid: Blend,
};
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Bootcamp Saya</h1>

    <!-- Skeleton -->
    <div v-if="isLoading" class="grid sm:grid-cols-2 gap-6">
      <div v-for="i in 2" :key="i" class="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
        <div class="aspect-video bg-gray-200" />
        <div class="p-4 space-y-3">
          <div class="h-4 bg-gray-200 rounded w-3/4" />
          <div class="h-3 bg-gray-200 rounded w-1/2" />
          <div class="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="isError" class="text-center py-16">
      <p class="text-gray-500">Gagal memuat bootcamp. Coba muat ulang halaman.</p>
    </div>

    <!-- Kosong -->
    <div v-else-if="!bootcamps.length" class="text-center py-20">
      <p class="text-gray-400 text-lg mb-4">Kamu belum mengikuti bootcamp apapun.</p>
      <RouterLink
        to="/bootcamps"
        class="inline-block px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
      >
        Jelajahi Bootcamp
      </RouterLink>
    </div>

    <template v-else>
      <!-- Berjalan & akan datang lebih dulu, yang selesai dipisah di bawah -->
      <div v-for="group in [
        { key: 'active', title: '', items: active },
        { key: 'finished', title: 'Sudah Selesai', items: finished },
      ]" :key="group.key">
        <h2
          v-if="group.title && group.items.length"
          class="text-sm font-bold text-gray-500 uppercase tracking-wide mt-10 mb-4"
        >
          {{ group.title }}
        </h2>

        <div v-if="group.items.length" class="grid sm:grid-cols-2 gap-6">
          <div
            v-for="item in group.items"
            :key="item.enrollment_id"
            class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            :class="item.status === 'finished' && 'opacity-75'"
          >
            <!-- Cover -->
            <RouterLink
              v-if="item.package"
              :to="`/bootcamps/${item.package._id}`"
              class="aspect-video overflow-hidden bg-gray-100 block group"
            >
              <img
                v-if="item.package.image_url"
                :src="item.package.image_url"
                :alt="item.package.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </RouterLink>
            <div v-else class="aspect-video bg-gray-100" />

            <div class="p-4 flex-1 flex flex-col">
              <div class="flex items-start justify-between gap-2 mb-1">
                <h3 class="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                  {{ item.package?.title ?? 'Bootcamp telah dihapus' }}
                </h3>
                <span
                  class="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
                  :class="bootcampStatusBadge[item.status]"
                >
                  {{ bootcampStatusLabel[item.status] }}
                </span>
              </div>

              <p class="text-xs text-gray-400 mb-3">
                {{ item.batch?.title ?? 'Batch telah dihapus' }}
                <template v-if="item.batch?.sub_title"> · {{ item.batch.sub_title }}</template>
              </p>

              <!-- Info batch -->
              <div class="space-y-1.5 text-xs text-gray-500">
                <p v-if="item.batch" class="flex items-center gap-1.5">
                  <CalendarDays class="w-3.5 h-3.5 shrink-0 text-gray-400" />
                  {{ formatSessionDate(item.batch.started_at) }} – {{ formatSessionDate(item.batch.ended_at) }}
                </p>
                <p class="flex items-center gap-1.5">
                  <Layers class="w-3.5 h-3.5 shrink-0 text-gray-400" />
                  {{ item.total_sessions }} sesi
                  <template v-if="item.batch">
                    ·
                    <component :is="packageTypeIcon[item.batch.package_type]" class="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    {{ packageTypeLabel[item.batch.package_type] }}
                  </template>
                </p>
              </div>

              <!-- Sesi berikutnya -->
              <div
                v-if="item.upcoming_session"
                class="mt-3 rounded-xl bg-indigo-50 border border-indigo-100 px-3 py-2.5"
              >
                <p class="text-xs font-semibold text-indigo-700 mb-0.5">Sesi Berikutnya</p>
                <p class="text-xs text-indigo-900 line-clamp-1">{{ item.upcoming_session.session_name }}</p>
                <p class="flex items-center gap-1.5 text-xs text-indigo-500 mt-1">
                  <Clock class="w-3 h-3 shrink-0" />
                  {{ formatSessionDate(item.upcoming_session.session_date) }} ·
                  {{ item.upcoming_session.session_start_time }}–{{ item.upcoming_session.session_end_time }}
                </p>
              </div>
              <p v-else-if="item.status === 'finished'" class="mt-3 text-xs text-gray-400">
                Seluruh sesi telah selesai.
              </p>
              <p v-else class="mt-3 text-xs text-gray-400">
                Jadwal sesi belum tersedia.
              </p>

              <!-- Sesi yang sedang berlangsung — pintu masuk terbuka 15 menit
                   sebelum jadwal, hilang sendiri setelah sesi berakhir -->
              <RouterLink
                v-if="liveSessionOf(item)"
                :to="`/bootcamps/sessions/${liveSessionOf(item)!._id}/live`"
                class="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                <Video class="w-4 h-4" />
                Gabung Sesi Sekarang
              </RouterLink>

              <RouterLink
                v-if="item.package"
                :to="`/bootcamps/${item.package._id}`"
                class="mt-auto pt-3 text-xs font-medium text-indigo-600 hover:underline"
              >
                Lihat Detail Bootcamp →
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
