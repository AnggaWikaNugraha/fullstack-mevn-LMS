<script setup lang="ts">
import { ref, watch } from 'vue';
import { Loader2 } from '@lucide/vue';
import { useProfile } from '@/composables/user/useProfile';

const {
  data,
  isLoading,
  profileError,
  profileSuccess,
  passwordError,
  passwordSuccess,
  isUpdatingProfile,
  isChangingPassword,
  submitProfile,
  submitChangePassword,
} = useProfile();

// Form update profil
const name = ref('');
const avatarUrl = ref('');

// Isi form saat data user selesai dimuat
watch(data, (val) => {
  if (val?.user) {
    name.value = val.user.name;
    avatarUrl.value = val.user.avatar_url ?? '';
  }
}, { immediate: true });

function onSubmitProfile() {
  submitProfile({ name: name.value, avatar_url: avatarUrl.value || undefined });
}

// Form ganti password
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

function onSubmitPassword() {
  submitChangePassword({
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
    confirmPassword: confirmPassword.value,
  }, {
    onSuccess: () => {
      currentPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
    },
  });
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-10 space-y-8">
    <h1 class="text-2xl font-bold text-gray-900">Profil Saya</h1>

    <!-- Skeleton -->
    <div v-if="isLoading" class="space-y-4 animate-pulse">
      <div class="h-5 bg-gray-200 rounded w-1/3"></div>
      <div class="h-10 bg-gray-200 rounded"></div>
      <div class="h-10 bg-gray-200 rounded"></div>
    </div>

    <template v-else>
      <!-- ── Update Profil ─────────────────────────────────────────────── -->
      <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-base font-semibold text-gray-900 mb-5">Informasi Profil</h2>

        <form class="space-y-4" @submit.prevent="onSubmitProfile">
          <!-- Email — readonly -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              :value="data?.user.email"
              type="email"
              disabled
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
            />
          </div>

          <!-- Nama -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              v-model="name"
              type="text"
              placeholder="Nama lengkap"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <!-- Avatar URL -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">URL Foto Profil</label>
            <input
              v-model="avatarUrl"
              type="url"
              placeholder="https://..."
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <div v-if="avatarUrl" class="mt-2 flex items-center gap-3">
              <img :src="avatarUrl" alt="preview" class="w-10 h-10 rounded-full object-cover border border-gray-200" />
              <span class="text-xs text-gray-400">Preview</span>
            </div>
          </div>

          <p v-if="profileError" class="text-sm text-red-500">{{ profileError }}</p>
          <p v-if="profileSuccess" class="text-sm text-green-600">{{ profileSuccess }}</p>

          <button
            type="submit"
            :disabled="isUpdatingProfile"
            class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            <Loader2 v-if="isUpdatingProfile" class="w-4 h-4 animate-spin" />
            {{ isUpdatingProfile ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </form>
      </section>

      <!-- ── Ganti Password ────────────────────────────────────────────── -->
      <!-- Sembunyikan untuk akun Google-only (tidak punya password) -->
      <section v-if="data?.user" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-base font-semibold text-gray-900 mb-5">Ganti Password</h2>

        <form class="space-y-4" @submit.prevent="onSubmitPassword">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
            <input
              v-model="currentPassword"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <input
              v-model="newPassword"
              type="password"
              placeholder="Minimal 8 karakter"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Ulangi password baru"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <p v-if="passwordError" class="text-sm text-red-500">{{ passwordError }}</p>
          <p v-if="passwordSuccess" class="text-sm text-green-600">{{ passwordSuccess }}</p>

          <button
            type="submit"
            :disabled="isChangingPassword"
            class="flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white text-sm font-semibold rounded-xl hover:bg-gray-900 disabled:opacity-60 transition-colors"
          >
            <Loader2 v-if="isChangingPassword" class="w-4 h-4 animate-spin" />
            {{ isChangingPassword ? 'Menyimpan...' : 'Ubah Password' }}
          </button>
        </form>
      </section>
    </template>
  </div>
</template>
