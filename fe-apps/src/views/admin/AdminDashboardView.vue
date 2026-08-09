<script setup lang="ts">
import { useDashboardStats } from '@/composables/admin/useDashboardStats';
import { formatRupiah, formatDate } from '@/utils/format';
import { Users, BookOpen, GraduationCap, Wallet, ShoppingCart } from '@lucide/vue';

const { stats, recentOrders, isLoading, isError } = useDashboardStats();
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-500 text-sm">Ringkasan aktivitas platform.</p>
    </div>

    <!-- Memuat -->
    <div v-if="isLoading" class="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-400">
      Memuat data...
    </div>

    <!-- Gagal -->
    <div v-else-if="isError || !stats" class="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-500">
      Gagal memuat statistik. Coba muat ulang halaman.
    </div>

    <template v-else>
      <!-- Kartu ringkasan -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center gap-2 text-gray-500 mb-3">
            <Users class="w-4 h-4" />
            <span class="text-xs font-medium uppercase tracking-wide">Pengguna</span>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ stats.users.total }}</p>
          <p class="text-xs text-emerald-600 mt-1">+{{ stats.users.newThisMonth }} bulan ini</p>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center gap-2 text-gray-500 mb-3">
            <BookOpen class="w-4 h-4" />
            <span class="text-xs font-medium uppercase tracking-wide">Course</span>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ stats.courses.published }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ stats.courses.draft }} masih draft</p>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center gap-2 text-gray-500 mb-3">
            <GraduationCap class="w-4 h-4" />
            <span class="text-xs font-medium uppercase tracking-wide">Enrollment</span>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ stats.enrollments.total }}</p>
          <p class="text-xs text-gray-400 mt-1">total pendaftaran course</p>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center gap-2 text-gray-500 mb-3">
            <Wallet class="w-4 h-4" />
            <span class="text-xs font-medium uppercase tracking-wide">Pendapatan</span>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ formatRupiah(stats.revenue.allTime) }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ formatRupiah(stats.revenue.thisMonth) }} bulan ini</p>
        </div>
      </div>

      <!-- Transaksi terbaru -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 class="text-sm font-bold text-gray-800">Transaksi Terbaru</h2>
          <RouterLink to="/admin/revenue" class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            Lihat Laporan
          </RouterLink>
        </div>

        <div v-if="!recentOrders.length" class="p-10 text-center">
          <ShoppingCart class="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p class="text-sm text-gray-500">Belum ada transaksi berhasil.</p>
        </div>

        <table v-else class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <th class="text-left px-5 py-3">Pembeli</th>
              <th class="text-left px-5 py-3 hidden md:table-cell">Course</th>
              <th class="text-left px-5 py-3 hidden lg:table-cell">Tanggal</th>
              <th class="text-right px-5 py-3">Nominal</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in recentOrders"
              :key="order._id"
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-5 py-3.5">
                <p class="font-medium" :class="order.user._id ? 'text-gray-800' : 'text-gray-400 italic'">
                  {{ order.user.name }}
                </p>
                <p class="text-xs text-gray-400">{{ order.user.email }}</p>
              </td>
              <td class="px-5 py-3.5 hidden md:table-cell" :class="order.course._id ? 'text-gray-600' : 'text-gray-400 italic'">
                {{ order.course.title }}
              </td>
              <td class="px-5 py-3.5 hidden lg:table-cell text-xs text-gray-500">
                {{ order.paidAt ? formatDate(order.paidAt) : '—' }}
              </td>
              <td class="px-5 py-3.5 text-right font-semibold text-gray-800">
                {{ formatRupiah(order.amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
