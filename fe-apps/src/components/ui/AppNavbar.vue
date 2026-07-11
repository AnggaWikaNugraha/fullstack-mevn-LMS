<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { LogOut, User, BookOpen, ShoppingBag, ChevronDown, Menu, X } from '@lucide/vue';
import { useAuthStore } from '@/stores/authStore';
import { logout as logoutApi } from '@/api/auth';
import { useDeviceId } from '@/composables/useDeviceId';

const router = useRouter();
const auth = useAuthStore();
const { getDeviceId } = useDeviceId();
const mobileOpen = ref(false);
const userMenuOpen = ref(false);

async function handleLogout() {
  try {
    await logoutApi(getDeviceId());
  } finally {
    auth.logout();
    userMenuOpen.value = false;
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
        <RouterLink to="/courses" class="hover:text-indigo-600 transition-colors" active-class="text-indigo-600">
          Courses
        </RouterLink>
        <RouterLink to="/bootcamps" class="hover:text-indigo-600 transition-colors" active-class="text-indigo-600">
          Bootcamp
        </RouterLink>
      </nav>

      <!-- Desktop auth -->
      <div class="hidden md:flex items-center gap-3">
        <template v-if="auth.isAuthenticated">
          <!-- Dropdown user menu -->
          <div class="relative">
            <button
              class="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              @click="userMenuOpen = !userMenuOpen"
            >
              <div class="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                <img v-if="auth.user?.avatar_url" :src="auth.user.avatar_url" class="w-full h-full object-cover" alt="avatar" />
                <User v-else class="w-4 h-4 text-indigo-600" />
              </div>
              <span>{{ auth.user?.name }}</span>
              <ChevronDown class="w-3.5 h-3.5" />
            </button>

            <!-- Dropdown panel -->
            <div
              v-if="userMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50"
              @mouseleave="userMenuOpen = false"
            >
              <RouterLink
                to="/my-courses"
                class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                @click="userMenuOpen = false"
              >
                <BookOpen class="w-4 h-4 text-gray-400" />
                Course Saya
              </RouterLink>
              <RouterLink
                to="/purchases"
                class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                @click="userMenuOpen = false"
              >
                <ShoppingBag class="w-4 h-4 text-gray-400" />
                Riwayat Pembelian
              </RouterLink>
              <RouterLink
                to="/profile"
                class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                @click="userMenuOpen = false"
              >
                <User class="w-4 h-4 text-gray-400" />
                Profil
              </RouterLink>
              <div class="border-t border-gray-100 mt-1 pt-1">
                <button
                  class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                  @click="handleLogout"
                >
                  <LogOut class="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
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
      <RouterLink to="/courses" class="text-sm font-medium text-gray-700" @click="mobileOpen = false">Courses</RouterLink>
      <RouterLink to="/bootcamps" class="text-sm font-medium text-gray-700" @click="mobileOpen = false">Bootcamp</RouterLink>

      <div class="border-t border-gray-100 pt-4 flex flex-col gap-3">
        <template v-if="auth.isAuthenticated">
          <div class="flex items-center gap-2 text-sm font-medium text-gray-700">
            <div class="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
              <img v-if="auth.user?.avatar_url" :src="auth.user.avatar_url" class="w-full h-full object-cover" alt="avatar" />
              <User v-else class="w-4 h-4 text-indigo-600" />
            </div>
            {{ auth.user?.name }}
          </div>
          <RouterLink to="/my-courses" class="text-sm text-gray-600" @click="mobileOpen = false">Course Saya</RouterLink>
          <RouterLink to="/purchases" class="text-sm text-gray-600" @click="mobileOpen = false">Riwayat Pembelian</RouterLink>
          <RouterLink to="/profile" class="text-sm text-gray-600" @click="mobileOpen = false">Profil</RouterLink>
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
