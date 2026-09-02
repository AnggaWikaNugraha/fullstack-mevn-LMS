<script setup lang="ts">
import { computed } from 'vue';
import { BarChart2 } from '@lucide/vue';
import { formatRupiah } from '@/utils/format';
import type { RevenueChartBar } from '@/composables/admin/useRevenueReport';

const props = defineProps<{
  title: string;
  bars: RevenueChartBar[];
  color: 'indigo' | 'amber';
  total: number;
  hasData: boolean;
  emptyLabel: string;
  dimmed?: boolean;
}>();

// Kelas ditulis utuh, bukan dirangkai, supaya terbaca pemindai Tailwind
const barClass: Record<'indigo' | 'amber', string> = {
  indigo: 'bg-indigo-500 group-hover:bg-indigo-600',
  amber: 'bg-amber-400 group-hover:bg-amber-500',
};
const dotClass: Record<'indigo' | 'amber', string> = {
  indigo: 'bg-indigo-500',
  amber: 'bg-amber-400',
};

const bar = computed(() => barClass[props.color]);
const dot = computed(() => dotClass[props.color]);

// Angka besar dipendekkan agar sumbu grafik tidak melebar
function ringkasRupiah(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} M`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} jt`;
  if (value >= 1_000) return `${Math.round(value / 1_000)} rb`;
  return String(value);
}
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-opacity"
    :class="dimmed && 'opacity-60'"
  >
    <div class="flex items-start justify-between gap-3 mb-5">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-sm shrink-0" :class="dot" />
        <h2 class="text-sm font-bold text-gray-800">{{ title }}</h2>
      </div>
      <p class="text-sm font-semibold text-gray-700 shrink-0">{{ formatRupiah(total) }}</p>
    </div>

    <div v-if="!hasData" class="py-10 text-center">
      <BarChart2 class="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <p class="text-sm text-gray-500">{{ emptyLabel }}</p>
    </div>

    <div v-else class="flex items-end gap-1.5 sm:gap-2.5 h-48">
      <div v-for="point in bars" :key="point.period" class="flex-1 flex flex-col items-center gap-2 h-full group">
        <!-- Kolom batang, tumbuh dari bawah -->
        <div class="relative flex-1 w-full flex items-end">
          <div
            class="w-full rounded-t-lg transition-[height,background-color] duration-300 min-h-0.5"
            :class="point.value ? bar : 'bg-gray-100'"
            :style="{ height: `${Math.max(point.percent, point.value ? 1 : 0)}%` }"
          />

          <!-- Rincian muncul saat kursor di atas kolom -->
          <div
            v-if="point.value"
            class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-[10px] leading-snug text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <p class="font-semibold">{{ formatRupiah(point.value) }}</p>
            <p class="text-gray-300">{{ point.orders }} order · {{ point.label }}</p>
          </div>
        </div>

        <!-- Nilai ringkas di bawah batang -->
        <span class="text-[10px] text-gray-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {{ ringkasRupiah(point.value) }}
        </span>
        <span class="text-[10px] sm:text-xs text-gray-400">{{ point.label }}</span>
      </div>
    </div>
  </div>
</template>
