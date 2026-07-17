<script setup lang="ts">
import { useRoute } from 'vue-router';
import {
  LayoutDashboard,
  BookOpen,
  CircleHelp,
  Users,
  GraduationCap,
  ShoppingCart,
  ClipboardList,
  BarChart2,
} from '@lucide/vue';
import AppNavbar from '@/components/ui/AppNavbar.vue';

const route = useRoute();

const menuItems = [
  { to: '/admin',           label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { to: '/admin/courses',   label: 'Courses',    icon: BookOpen },
  { to: '/admin/quiz',      label: 'Quiz',       icon: CircleHelp },
  { to: '/admin/users',     label: 'Users',      icon: Users },
  { to: '/admin/bootcamps', label: 'Bootcamps',  icon: GraduationCap },
  { to: '/admin/orders',    label: 'Orders',     icon: ShoppingCart },
  { to: '/admin/tasks',     label: 'Tasks',      icon: ClipboardList },
  { to: '/admin/revenue',   label: 'Revenue',    icon: BarChart2 },
];

function isActive(item: typeof menuItems[0]) {
  if (item.exact) return route.path === item.to;
  return route.path.startsWith(item.to);
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppNavbar />

    <div class="flex-1 flex max-w-7xl mx-auto w-full px-4 py-8 gap-8">

      <!-- Sidebar -->
      <aside class="hidden md:block w-56 shrink-0">
        <nav class="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sticky top-24">
          <RouterLink
            v-for="item in menuItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
            :class="isActive(item)
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'"
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
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-white whitespace-nowrap transition-colors"
            :class="isActive(item)
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'text-gray-600 border-gray-200 hover:border-indigo-300'"
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
