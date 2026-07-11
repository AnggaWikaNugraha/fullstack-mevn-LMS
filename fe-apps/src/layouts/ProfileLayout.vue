<script setup lang="ts">
import { BookOpen, ShoppingBag, User } from '@lucide/vue';
import AppNavbar from '@/components/ui/AppNavbar.vue';

const menuItems = [
  { to: '/my-courses', label: 'Course Saya', icon: BookOpen },
  { to: '/profile', label: 'Profil', icon: User },
  { to: '/purchases', label: 'Riwayat Pembelian', icon: ShoppingBag },
];
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppNavbar />

    <div class="flex-1 flex max-w-6xl mx-auto w-full px-4 py-8 gap-8">

      <!-- Sidebar -->
      <aside class="hidden md:block w-56 shrink-0">
        <nav class="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sticky top-24">
          <RouterLink
            v-for="item in menuItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
            active-class="bg-indigo-50 text-indigo-600"
          >
            <component :is="item.icon" class="w-4 h-4 shrink-0" />
            {{ item.label }}
          </RouterLink>
        </nav>
      </aside>

      <!-- Konten halaman -->
      <main class="flex-1 min-w-0">
        <!-- Mobile nav pill -->
        <div class="flex md:hidden gap-2 mb-6 overflow-x-auto pb-1">
          <RouterLink
            v-for="item in menuItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 border border-gray-200 bg-white whitespace-nowrap hover:border-indigo-300 transition-colors"
            active-class="bg-indigo-600 text-white border-indigo-600"
          >
            <component :is="item.icon" class="w-3.5 h-3.5" />
            {{ item.label }}
          </RouterLink>
        </div>

        <RouterView />
      </main>
    </div>
  </div>
</template>
