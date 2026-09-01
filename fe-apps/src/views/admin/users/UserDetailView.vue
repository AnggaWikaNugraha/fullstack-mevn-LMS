<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useUserDetail, roleBadge, roleOptions, statusBadge, formatDate, formatRupiah } from '@/composables/admin/useUserDetail';
import type { AdminUser, AdminUserOrder } from '@/api/admin/users';
import { BookOpen, ShoppingCart, ArrowLeft } from '@lucide/vue';

const route = useRoute();
const userId = route.params.id as string;

const { user, enrollments, orders, totalSpent, isLoading, changeRole, changingRole } = useUserDetail(userId);

// Satu daftar memuat order course dan bootcamp, judulnya diambil dari ref yang sesuai
function orderTitle(order: AdminUserOrder): string {
  if (order.type === 'bootcamp') {
    return order.batchId
      ? `${order.batchId.packageId?.title ?? 'Bootcamp'} — ${order.batchId.title}`
      : 'Batch dihapus';
  }
  return order.courseId?.title ?? 'Kursus dihapus';
}
</script>

<template>
  <div class="max-w-3xl">
    <!-- Back -->
    <div class="flex items-center gap-3 mb-6">
      <RouterLink to="/admin/users" class="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
        <ArrowLeft class="w-4 h-4" /> Users
      </RouterLink>
      <span class="text-gray-300">/</span>
      <h1 class="text-xl font-bold text-gray-900">Detail User</h1>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-400">
      Memuat data...
    </div>

    <template v-else-if="user">
      <!-- User card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div class="flex items-start gap-5">
          <!-- Avatar -->
          <img
            v-if="user.avatar_url"
            :src="user.avatar_url"
            :alt="user.name"
            class="w-16 h-16 rounded-full object-cover shrink-0"
          />
          <div v-else class="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <span class="text-2xl font-bold text-indigo-600">{{ user.name.charAt(0).toUpperCase() }}</span>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 flex-wrap mb-1">
              <h2 class="text-lg font-bold text-gray-900">{{ user.name }}</h2>
              <span
                class="text-xs px-2.5 py-1 rounded-full font-medium"
                :class="user.isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'"
              >
                {{ user.isVerified ? 'Verified' : 'Unverified' }}
              </span>
            </div>
            <p class="text-sm text-gray-500 mb-3">{{ user.email }}</p>

            <!-- Role picker -->
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500 font-medium">Role:</span>
              <select
                :value="user.role"
                :disabled="changingRole"
                class="text-xs font-semibold px-2.5 py-1 rounded-lg border-0 outline-none cursor-pointer disabled:opacity-60"
                :class="roleBadge[user.role]"
                @change="changeRole(($event.target as HTMLSelectElement).value as AdminUser['role'])"
              >
                <option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
          </div>

          <!-- Stats -->
          <div class="hidden sm:flex flex-col items-end gap-1 shrink-0">
            <p class="text-xs text-gray-400">Bergabung</p>
            <p class="text-sm font-medium text-gray-700">{{ formatDate(user.createdAt) }}</p>
            <p class="text-xs text-gray-400 mt-2">Total pembelian</p>
            <p class="text-sm font-semibold text-emerald-600">{{ formatRupiah(totalSpent) }}</p>
          </div>
        </div>
      </div>

      <!-- Stats mobile -->
      <div class="sm:hidden grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white rounded-xl border border-gray-100 p-4">
          <p class="text-xs text-gray-400 mb-1">Bergabung</p>
          <p class="text-sm font-medium text-gray-700">{{ formatDate(user.createdAt) }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4">
          <p class="text-xs text-gray-400 mb-1">Total pembelian</p>
          <p class="text-sm font-semibold text-emerald-600">{{ formatRupiah(totalSpent) }}</p>
        </div>
      </div>

      <!-- Enrolled Courses -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4">
        <div class="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <BookOpen class="w-4 h-4 text-indigo-500" />
          <h3 class="font-semibold text-gray-800 text-sm">Kursus Diikuti</h3>
          <span class="ml-auto text-xs text-gray-400">{{ enrollments.length }} kursus</span>
        </div>

        <div v-if="!enrollments.length" class="px-5 py-6 text-center text-sm text-gray-400">
          Belum ada kursus yang diikuti.
        </div>
        <div v-else class="divide-y divide-gray-50">
          <div
            v-for="enrollment in enrollments"
            :key="enrollment._id"
            class="flex items-center gap-3 px-5 py-3.5"
          >
            <img
              v-if="enrollment.courseId?.cover_url"
              :src="enrollment.courseId.cover_url"
              :alt="enrollment.courseId.title"
              class="w-10 h-10 rounded-lg object-cover shrink-0"
            />
            <div v-else class="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">
                {{ enrollment.courseId?.title ?? 'Kursus dihapus' }}
              </p>
              <p class="text-xs text-gray-400">
                {{ enrollment.courseId?.topic_name }} · {{ enrollment.courseId?.level }}
              </p>
            </div>
            <span class="text-xs text-gray-400 shrink-0">{{ formatDate(enrollment.enrolledAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Orders -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div class="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <ShoppingCart class="w-4 h-4 text-indigo-500" />
          <h3 class="font-semibold text-gray-800 text-sm">Riwayat Order</h3>
          <span class="ml-auto text-xs text-gray-400">{{ orders.length }} order</span>
        </div>

        <div v-if="!orders.length" class="px-5 py-6 text-center text-sm text-gray-400">
          Belum ada order.
        </div>
        <div v-else class="divide-y divide-gray-50">
          <div
            v-for="order in orders"
            :key="order._id"
            class="flex items-center gap-3 px-5 py-3.5"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">
                <span
                  v-if="order.type === 'bootcamp'"
                  class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 mr-1.5"
                >
                  Bootcamp
                </span>
                {{ orderTitle(order) }}
              </p>
              <p class="text-xs text-gray-400">{{ order.midtrans_order_id }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm font-semibold text-gray-700">{{ formatRupiah(order.amount) }}</p>
              <span
                class="inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-0.5"
                :class="statusBadge[order.status]"
              >
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
