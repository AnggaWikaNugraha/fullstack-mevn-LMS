<script setup lang="ts">
import { useBootcampList } from '@/composables/admin/useBootcampList';

const { packages, isLoading, confirmDelete } = useBootcampList();

const statusLabel: Record<string, string> = {
  open: 'Open',
  coming_soon: 'Coming Soon',
  closed: 'Closed',
};

const statusClass: Record<string, string> = {
  open: 'bg-green-100 text-green-700',
  coming_soon: 'bg-amber-100 text-amber-700',
  closed: 'bg-gray-100 text-gray-500',
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Bootcamps</h1>
        <p class="text-sm text-gray-500 mt-0.5">Kelola semua paket bootcamp</p>
      </div>
      <RouterLink
        to="/admin/bootcamps/new"
        class="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
      >
        + Tambah Bootcamp
      </RouterLink>
    </div>

    <!-- Skeleton -->
    <div v-if="isLoading" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div v-for="i in 3" :key="i" class="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0 animate-pulse">
        <div class="w-16 h-12 bg-gray-200 rounded-lg shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          <div class="h-3 bg-gray-200 rounded w-1/5"></div>
        </div>
      </div>
    </div>

    <!-- List -->
    <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div v-if="!packages?.length" class="text-center py-16 text-gray-400 text-sm">
        Belum ada bootcamp. Klik "+ Tambah Bootcamp" untuk mulai.
      </div>

      <div
        v-for="pkg in packages"
        :key="pkg._id"
        class="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
      >
        <!-- Gambar -->
        <div class="w-16 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          <img v-if="pkg.image_url" :src="pkg.image_url" :alt="pkg.title" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 truncate">{{ pkg.title }}</p>
          <p class="text-xs text-gray-400 mt-0.5">
            {{ pkg.batch_count }} batch · {{ pkg.mentors.length }} mentor
          </p>
        </div>

        <!-- Status -->
        <span
          class="px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
          :class="statusClass[pkg.status]"
        >
          {{ statusLabel[pkg.status] }}
        </span>

        <!-- Aksi -->
        <div class="flex items-center gap-2 shrink-0">
          <RouterLink
            :to="`/admin/bootcamps/${pkg._id}/content`"
            class="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Konten
          </RouterLink>
          <RouterLink
            :to="`/admin/bootcamps/${pkg._id}/edit`"
            class="px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors"
          >
            Edit
          </RouterLink>
          <button
            class="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            @click="confirmDelete(pkg._id, pkg.title)"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
