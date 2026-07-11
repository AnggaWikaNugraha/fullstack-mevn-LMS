<script setup lang="ts">
import { useOrders } from '@/composables/orders/useOrders';
import { formatRupiah, formatDate } from '@/utils/format';

const {
  orders,
  isLoading,
  isError,
} = useOrders();

const statusConfig: Record<string, { label: string; class: string }> = {
  paid: { label: 'Berhasil', class: 'bg-green-100 text-green-700' },
  pending: { label: 'Menunggu', class: 'bg-yellow-100 text-yellow-700' },
  failed: { label: 'Gagal', class: 'bg-red-100 text-red-700' },
  expired: { label: 'Kedaluwarsa', class: 'bg-gray-100 text-gray-500' },
};
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Riwayat Pembelian</h1>

    <!-- Skeleton -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 animate-pulse">
        <div class="w-20 h-14 bg-gray-200 rounded-lg shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          <div class="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="isError" class="text-center py-16">
      <p class="text-gray-500">Gagal memuat riwayat. Coba muat ulang halaman.</p>
    </div>

    <!-- Kosong -->
    <div v-else-if="!orders.length" class="text-center py-20">
      <p class="text-gray-400 text-lg">Belum ada transaksi.</p>
    </div>

    <!-- Daftar order -->
    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order._id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-center"
      >
        <!-- Cover kurs -->
        <div class="w-20 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <img
            :src="order.courseId.cover_url"
            :alt="order.courseId.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-900 text-sm truncate">{{ order.courseId.title }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(order.createdAt) }}</p>
          <p class="text-xs text-gray-500 mt-0.5 font-mono truncate">{{ order.midtrans_order_id }}</p>
        </div>

        <!-- Harga + status -->
        <div class="text-right shrink-0">
          <p class="font-bold text-gray-900 text-sm">{{ formatRupiah(order.amount) }}</p>
          <span
            class="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full"
            :class="statusConfig[order.status].class"
          >
            {{ statusConfig[order.status].label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
