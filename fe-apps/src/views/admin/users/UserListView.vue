<script setup lang="ts">
import { ref } from 'vue';
import { useUserList } from '@/composables/admin/useUserList';
import { Search, UserCircle, ChevronLeft, ChevronRight } from '@lucide/vue';
import type { AdminUser } from '@/api/admin/users';

const { users, pagination, isLoading, setSearch, page, changeRole, changingRole } = useUserList();

const searchInput = ref('');
let debounceTimer: ReturnType<typeof setTimeout>;
function onSearch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => setSearch(searchInput.value), 350);
}

const roleOptions: AdminUser['role'][] = ['student', 'instructor', 'mentor', 'admin'];

const roleBadge: Record<AdminUser['role'], string> = {
  student:    'bg-gray-100 text-gray-600',
  instructor: 'bg-blue-100 text-blue-700',
  mentor:     'bg-emerald-100 text-emerald-700',
  admin:      'bg-red-100 text-red-700',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-bold text-gray-900">Users</h1>
      <span v-if="pagination" class="text-sm text-gray-400">{{ pagination.total }} pengguna</span>
    </div>

    <!-- Search -->
    <div class="relative mb-4">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        v-model="searchInput"
        type="text"
        placeholder="Cari nama atau email..."
        class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        @input="onSearch"
      />
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-400">
      Memuat data...
    </div>

    <!-- Kosong -->
    <div v-else-if="!users.length" class="bg-white rounded-2xl border border-gray-100 p-10 text-center">
      <UserCircle class="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <p class="text-sm text-gray-500">Tidak ada user ditemukan.</p>
    </div>

    <!-- Tabel -->
    <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <th class="text-left px-5 py-3">User</th>
            <th class="text-left px-5 py-3">Role</th>
            <th class="text-left px-5 py-3 hidden md:table-cell">Status</th>
            <th class="text-left px-5 py-3 hidden lg:table-cell">Bergabung</th>
            <th class="w-40 px-5 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user._id"
            class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
          >
            <!-- Info user -->
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <img
                  v-if="user.avatar_url"
                  :src="user.avatar_url"
                  :alt="user.name"
                  class="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div v-else class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <span class="text-xs font-bold text-indigo-600">{{ user.name.charAt(0).toUpperCase() }}</span>
                </div>
                <div>
                  <RouterLink
                    :to="`/admin/users/${user._id}`"
                    class="font-medium text-gray-800 hover:text-indigo-600 transition-colors"
                  >
                    {{ user.name }}
                  </RouterLink>
                  <p class="text-xs text-gray-400">{{ user.email }}</p>
                </div>
              </div>
            </td>

            <!-- Role dropdown -->
            <td class="px-5 py-3.5">
              <select
                :value="user.role"
                :disabled="changingRole"
                class="text-xs font-semibold px-2.5 py-1 rounded-lg border-0 outline-none cursor-pointer"
                :class="roleBadge[user.role]"
                @change="changeRole({ id: user._id, role: ($event.target as HTMLSelectElement).value as AdminUser['role'] })"
              >
                <option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</option>
              </select>
            </td>

            <!-- Status verifikasi -->
            <td class="px-5 py-3.5 hidden md:table-cell">
              <span
                class="inline-block text-xs px-2.5 py-1 rounded-full font-medium"
                :class="user.isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'"
              >
                {{ user.isVerified ? 'Verified' : 'Unverified' }}
              </span>
            </td>

            <!-- Tanggal bergabung -->
            <td class="px-5 py-3.5 hidden lg:table-cell text-gray-500 text-xs">
              {{ formatDate(user.createdAt) }}
            </td>

            <!-- Aksi -->
            <td class="px-5 py-3.5 text-right">
              <RouterLink
                :to="`/admin/users/${user._id}`"
                class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Lihat Detail
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.totalPages > 1" class="flex items-center justify-between mt-4">
      <span class="text-xs text-gray-500">
        Halaman {{ pagination.page }} dari {{ pagination.totalPages }}
      </span>
      <div class="flex gap-2">
        <button
          :disabled="page <= 1"
          class="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          @click="page--"
        >
          <ChevronLeft class="w-3.5 h-3.5" /> Prev
        </button>
        <button
          :disabled="page >= pagination.totalPages"
          class="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          @click="page++"
        >
          Next <ChevronRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>
