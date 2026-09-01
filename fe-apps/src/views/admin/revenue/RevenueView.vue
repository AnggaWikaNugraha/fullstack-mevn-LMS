<script setup lang="ts">
import { useRevenueReport } from '@/composables/admin/useRevenueReport';
import { formatRupiah } from '@/utils/format';
import { BarChart2 } from '@lucide/vue';

const {
  bars, summary, topCourses, topBootcamps,
  year, availableYears, selectYear,
  hasData, isLoading, isFetching,
} = useRevenueReport();

// Angka besar dipendekkan agar sumbu grafik tidak melebar
function ringkasRupiah(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} M`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} jt`;
  if (value >= 1_000) return `${Math.round(value / 1_000)} rb`;
  return String(value);
}

const persen = (v: number) => `${(v * 100).toFixed(1)}%`;
</script>

<template>
  <div>
    <!-- Header + pemilih tahun -->
    <div class="flex items-center justify-between mb-6 gap-4">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Revenue</h1>
        <p class="text-gray-500 text-sm">Laporan pendapatan dari penjualan course dan bootcamp.</p>
      </div>
      <select
        v-if="availableYears.length"
        :value="year ?? undefined"
        class="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
        @change="selectYear(Number(($event.target as HTMLSelectElement).value))"
      >
        <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <div v-if="isLoading" class="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-400">
      Memuat laporan...
    </div>

    <template v-else>
      <!-- Ringkasan -->
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Total {{ year }}</p>
          <p class="text-xl font-bold text-gray-900">{{ formatRupiah(summary?.total ?? 0) }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Order Terbayar</p>
          <p class="text-xl font-bold text-gray-900">{{ summary?.paidOrders ?? 0 }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Rata-rata Order</p>
          <p class="text-xl font-bold text-gray-900">{{ formatRupiah(summary?.avgOrderValue ?? 0) }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Konversi</p>
          <p class="text-xl font-bold text-gray-900">{{ persen(summary?.conversionRate ?? 0) }}</p>
          <p class="text-xs text-gray-400 mt-1">dari order yang dibuat</p>
        </div>
      </div>

      <!-- Grafik batang bulanan -->
      <div
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 transition-opacity"
        :class="isFetching && 'opacity-60'"
      >
        <h2 class="text-sm font-bold text-gray-800 mb-5">Pendapatan per Bulan</h2>

        <div v-if="!hasData" class="py-10 text-center">
          <BarChart2 class="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p class="text-sm text-gray-500">Belum ada transaksi di tahun {{ year }}.</p>
        </div>

        <div v-else class="flex items-end gap-1.5 sm:gap-3 h-56">
          <div v-for="bar in bars" :key="bar.period" class="flex-1 flex flex-col items-center gap-2 h-full group">
            <!-- Kolom batang, tumbuh dari bawah -->
            <div class="flex-1 w-full flex items-end">
              <div
                class="w-full rounded-t-lg bg-indigo-500 group-hover:bg-indigo-600 transition-[height,background-color] duration-300 min-h-0.5"
                :style="{ height: `${bar.heightPercent}%` }"
              />
            </div>
            <!-- Nilai muncul saat kursor di atas batang -->
            <span class="text-[10px] text-gray-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {{ ringkasRupiah(bar.total) }}
            </span>
            <span class="text-[10px] sm:text-xs text-gray-400">{{ bar.label }}</span>
          </div>
        </div>
      </div>

      <!-- Course terlaris -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h2 class="text-sm font-bold text-gray-800">Course Penyumbang Terbesar</h2>
        </div>

        <div v-if="!topCourses.length" class="p-10 text-center text-sm text-gray-500">
          Belum ada penjualan di tahun {{ year }}.
        </div>

        <table v-else class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <th class="text-left px-5 py-3">Course</th>
              <th class="text-right px-5 py-3">Terjual</th>
              <th class="text-right px-5 py-3">Pendapatan</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="course in topCourses"
              :key="course.courseId"
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <img
                    v-if="course.cover_url"
                    :src="course.cover_url"
                    :alt="course.title"
                    class="w-10 h-7 rounded object-cover shrink-0 bg-gray-100"
                  />
                  <div v-else class="w-10 h-7 rounded bg-gray-100 shrink-0" />
                  <span class="font-medium text-gray-800">{{ course.title }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5 text-right text-gray-600">{{ course.sold }}</td>
              <td class="px-5 py-3.5 text-right font-semibold text-gray-800">
                {{ formatRupiah(course.revenue) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Bootcamp terlaris — dipisah karena dikelompokkan per batch, bukan per course -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
        <div class="px-5 py-4 border-b border-gray-100">
          <h2 class="text-sm font-bold text-gray-800">Bootcamp Penyumbang Terbesar</h2>
        </div>

        <div v-if="!topBootcamps.length" class="p-10 text-center text-sm text-gray-500">
          Belum ada penjualan bootcamp di tahun {{ year }}.
        </div>

        <table v-else class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <th class="text-left px-5 py-3">Batch</th>
              <th class="text-right px-5 py-3">Terjual</th>
              <th class="text-right px-5 py-3">Pendapatan</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="bootcamp in topBootcamps"
              :key="bootcamp.batchId"
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <img
                    v-if="bootcamp.image_url"
                    :src="bootcamp.image_url"
                    :alt="bootcamp.title"
                    class="w-10 h-7 rounded object-cover shrink-0 bg-gray-100"
                  />
                  <div v-else class="w-10 h-7 rounded bg-gray-100 shrink-0" />
                  <div class="min-w-0">
                    <p class="font-medium text-gray-800 truncate">{{ bootcamp.title }}</p>
                    <p class="text-xs text-gray-400">{{ bootcamp.batch_title }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5 text-right text-gray-600">{{ bootcamp.sold }}</td>
              <td class="px-5 py-3.5 text-right font-semibold text-gray-800">
                {{ formatRupiah(bootcamp.revenue) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
