<script setup lang="ts">
import type { BootcampPackage } from '@/types/bootcamps';
import { formatRupiah } from '@/utils/format';

const props = defineProps<{
  bootcamp: BootcampPackage & { starting_price?: number };
}>();

const statusConfig = {
  open: { label: 'Buka Pendaftaran', class: 'bg-green-100 text-green-700' },
  coming_soon: { label: 'Segera Hadir', class: 'bg-amber-100 text-amber-700' },
  closed: { label: 'Ditutup', class: 'bg-gray-100 text-gray-500' },
};
</script>

<template>
  <RouterLink
    :to="`/bootcamps/${bootcamp._id}`"
    class="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
  >
    <!-- Cover image -->
    <div class="aspect-[16/9] bg-gray-100 overflow-hidden relative">
      <img
        :src="bootcamp.image_url"
        :alt="bootcamp.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <span
        class="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
        :class="statusConfig[bootcamp.status].class"
      >
        {{ statusConfig[bootcamp.status].label }}
      </span>
    </div>

    <!-- Konten -->
    <div class="p-5 flex flex-col flex-1">
      <h3 class="font-bold text-gray-900 text-base leading-snug line-clamp-2">
        {{ bootcamp.title }}
      </h3>
      <p class="text-gray-500 text-sm mt-2 line-clamp-2 flex-1">
        {{ bootcamp.description }}
      </p>

      <!-- Mentor avatar stack -->
      <div v-if="bootcamp.mentors.length" class="flex items-center gap-2 mt-4">
        <div class="flex -space-x-2">
          <img
            v-for="(mentor, i) in bootcamp.mentors.slice(0, 3)"
            :key="i"
            :src="mentor.image_url"
            :alt="mentor.name"
            class="w-7 h-7 rounded-full border-2 border-white object-cover"
          />
        </div>
        <span class="text-xs text-gray-400 truncate">
          {{ bootcamp.mentors.map((m) => m.name).join(', ') }}
        </span>
      </div>

      <!-- Harga -->
      <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div v-if="bootcamp.starting_price">
          <p class="text-xs text-gray-400">Mulai dari</p>
          <p class="text-base font-bold text-gray-900">{{ formatRupiah(bootcamp.starting_price) }}</p>
        </div>
        <div v-else class="text-sm text-gray-400">Harga belum tersedia</div>

        <span class="text-xs font-medium text-indigo-600 group-hover:underline">
          Lihat Detail →
        </span>
      </div>
    </div>
  </RouterLink>
</template>
