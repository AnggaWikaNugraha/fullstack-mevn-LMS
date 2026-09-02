<script setup lang="ts">
import { useRevenueReport } from '@/composables/admin/useRevenueReport';
import { formatRupiah } from '@/utils/format';
import RevenueBarChart from '@/components/admin/RevenueBarChart.vue';

const {
  courseBars, bootcampBars, summary, topCourses, topBootcamps,
  hasBootcampRevenue, hasCourseRevenue,
  year, availableYears, selectYear,
  isLoading, isFetching,
} = useRevenueReport();

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
          <!-- Pecahan course/bootcamp agar angka gabungan di atas bisa ditelusuri -->
          <p class="text-xs text-gray-400 mt-1.5 leading-relaxed">
            <span class="inline-flex items-center gap-1">
              <span class="w-2 h-2 rounded-sm bg-indigo-500" />
              Course {{ formatRupiah(summary?.courseTotal ?? 0) }}
            </span>
            <br />
            <span class="inline-flex items-center gap-1">
              <span class="w-2 h-2 rounded-sm bg-amber-400" />
              Bootcamp {{ formatRupiah(summary?.bootcampTotal ?? 0) }}
            </span>
          </p>
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

      <!-- Dua grafik terpisah: course dan bootcamp tidak ditumpuk supaya
           masing-masing terbaca sendiri. Skalanya sengaja disamakan agar
           tinggi batang di kedua grafik tetap bisa dibandingkan. -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <RevenueBarChart
          title="Pendapatan Course per Bulan"
          color="indigo"
          :bars="courseBars"
          :total="summary?.courseTotal ?? 0"
          :has-data="hasCourseRevenue"
          :dimmed="isFetching"
          :empty-label="`Belum ada penjualan course di tahun ${year}.`"
        />
        <RevenueBarChart
          title="Pendapatan Bootcamp per Bulan"
          color="amber"
          :bars="bootcampBars"
          :total="summary?.bootcampTotal ?? 0"
          :has-data="hasBootcampRevenue"
          :dimmed="isFetching"
          :empty-label="`Belum ada penjualan bootcamp di tahun ${year}.`"
        />
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
