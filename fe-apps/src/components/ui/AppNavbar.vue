<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { LogOut, User, Menu, X } from '@lucide/vue';
import { useAuthStore } from '@/stores/authStore';
import { logout as logoutApi } from '@/api/auth';
import { useDeviceId } from '@/composables/useDeviceId';

const router = useRouter();
const auth = useAuthStore();
const { getDeviceId } = useDeviceId();
const mobileOpen = ref(false);

async function handleLogout() {
  try {
    await logoutApi(getDeviceId());
  } finally {
    auth.logout();
    router.push('/auth/login');
  }
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

      <!-- Logo -->
      <RouterLink to="/" class="text-xl font-bold text-indigo-600 tracking-tight">
        SkilLine
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
        <RouterLink to="/" class="hover:text-indigo-600 transition-colors" active-class="text-indigo-600">
          Courses
        </RouterLink>
        <RouterLink to="/bootcamps" class="hover:text-indigo-600 transition-colors" active-class="text-indigo-600">
          Bootcamp
        </RouterLink>
      </nav>

      <!-- Desktop auth -->
      <div class="hidden md:flex items-center gap-3">
        <template v-if="auth.isAuthenticated">
          <span class="text-sm text-gray-600 font-medium">{{ auth.user?.name }}</span>
          <button
            class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
            @click="handleLogout"
          >
            <LogOut class="w-4 h-4" />
            Logout
          </button>
        </template>

        <template v-else>
          <RouterLink to="/auth/login" class="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Login
          </RouterLink>
          <RouterLink
            to="/auth/register"
            class="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors"
          >
            Sign Up
          </RouterLink>
        </template>
      </div>

      <!-- Mobile menu button -->
      <button class="md:hidden text-gray-600" @click="mobileOpen = !mobileOpen">
        <X v-if="mobileOpen" class="w-5 h-5" />
        <Menu v-else class="w-5 h-5" />
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
      <RouterLink to="/" class="text-sm font-medium text-gray-700" @click="mobileOpen = false">Courses</RouterLink>
      <RouterLink to="/bootcamps" class="text-sm font-medium text-gray-700" @click="mobileOpen = false">Bootcamp</RouterLink>

      <div class="border-t border-gray-100 pt-4 flex flex-col gap-3">
        <template v-if="auth.isAuthenticated">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <User class="w-4 h-4" />
            {{ auth.user?.name }}
          </div>
          <button class="text-sm text-red-500 text-left" @click="handleLogout">Logout</button>
        </template>
        <template v-else>
          <RouterLink to="/auth/login" class="text-sm font-medium text-gray-700" @click="mobileOpen = false">Login</RouterLink>
          <RouterLink to="/auth/register" class="text-sm font-semibold text-indigo-600" @click="mobileOpen = false">Sign Up</RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>
