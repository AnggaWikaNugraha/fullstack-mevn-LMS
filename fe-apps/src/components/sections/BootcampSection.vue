<script setup lang="ts">
import BootcampCard from '@/components/course/BootcampCard.vue';
import { useBootcamps } from '@/composables/bootcamps/useBootcamps';

const {
  bootcamps,
  isLoading,
  isError,
} = useBootcamps();
</script>

<template>
  <section class="py-12 px-4 max-w-7xl mx-auto">
    <div class="flex items-end justify-between mb-6">
      <div>
        <p class="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-1">Program Intensif</p>
        <h2 class="text-2xl font-bold text-gray-900">Bootcamp Kami</h2>
      </div>
      <RouterLink
        to="/bootcamps"
        class="text-sm font-medium text-indigo-600 hover:underline hidden sm:block"
      >
        Lihat Semua →
      </RouterLink>
    </div>

    <!-- Skeleton loading -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="i in 3" :key="i" class="rounded-2xl overflow-hidden border border-gray-100">
        <div class="aspect-[16/9] bg-gray-200 animate-pulse" />
        <div class="p-5 space-y-3">
          <div class="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div class="h-3 w-full bg-gray-200 rounded animate-pulse" />
          <div class="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="isError" class="text-center py-12 text-gray-400">
      Gagal memuat data bootcamp. Coba refresh halaman.
    </div>

    <!-- Empty state -->
    <div v-else-if="bootcamps.length === 0" class="text-center py-12 text-gray-400">
      Belum ada program bootcamp tersedia.
    </div>

    <!-- Grid bootcamp -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <BootcampCard v-for="bootcamp in bootcamps" :key="bootcamp._id" :bootcamp="bootcamp" />
    </div>

    <div class="mt-6 sm:hidden text-center">
      <RouterLink to="/bootcamps" class="text-sm font-medium text-indigo-600 hover:underline">
        Lihat Semua Bootcamp →
      </RouterLink>
    </div>
  </section>
</template>
