<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEnrollment } from '@/composables/checkout/useEnrollment';

const route = useRoute();
const router = useRouter();

const result = route.query.result as string;
const courseId = (route.query.course_id as string) ?? '';
const orderId = (route.query.order_id as string) ?? '';

const { startPolling, manualVerify, isPolling, isTimedOut, isVerifying } = useEnrollment(courseId);

const config = computed(() => {
  if (result === 'success') {
    return {
      icon: '✅',
      title: 'Pembayaran Berhasil!',
      desc: 'Mengaktifkan akses kursmu...',
      color: 'text-green-600',
      bg: 'bg-green-50 border-green-200',
    };
  }
  if (result === 'pending') {
    return {
      icon: '⏳',
      title: 'Pembayaran Menunggu Konfirmasi',
      desc: 'Akses akan aktif otomatis setelah pembayaran dikonfirmasi.',
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
    };
  }
  return {
    icon: '❌',
    title: 'Pembayaran Gagal',
    desc: 'Silakan coba lagi atau pilih metode pembayaran lain.',
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-200',
  };
});

function goToCourse() {
  router.push(`/courses/${courseId}`);
}

onMounted(() => {
  if (!courseId) {
    router.replace('/courses');
    return;
  }
  if (result === 'success' || result === 'pending') {
    startPolling(goToCourse, () => {
      // webhook tidak sampai dalam 30 detik — tampilkan tombol cek manual
    });
  }
});
</script>

<template>
  <div class="min-h-[calc(100vh-128px)] flex items-center justify-center px-4">
    <div
      class="max-w-md w-full rounded-2xl border p-10 text-center"
      :class="config.bg"
    >
      <div class="text-6xl mb-6">{{ config.icon }}</div>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ config.title }}</h1>
      <p class="text-gray-500 mb-8">{{ config.desc }}</p>

      <!-- Spinner saat polling enrollment -->
      <div v-if="isPolling" class="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
        <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Memverifikasi pembayaran...
      </div>

      <!-- Timeout state — webhook tidak sampai dalam 30 detik -->
      <div v-if="isTimedOut" class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
        Verifikasi otomatis membutuhkan waktu lebih lama dari biasanya.
        Klik tombol di bawah untuk cek status pembayaran secara manual.
      </div>

      <div class="flex flex-col gap-3">
        <!-- Tombol cek manual saat timeout -->
        <button
          v-if="isTimedOut && orderId"
          :disabled="isVerifying"
          class="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          @click="manualVerify(orderId, goToCourse)"
        >
          <svg v-if="isVerifying" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ isVerifying ? 'Memeriksa...' : 'Cek Status Pembayaran' }}
        </button>

        <RouterLink
          v-if="result === 'error'"
          :to="`/courses/${courseId}`"
          class="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition text-center"
        >
          Coba Lagi
        </RouterLink>

        <RouterLink
          to="/courses"
          class="w-full py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition text-center text-sm"
        >
          Kembali ke Daftar Kurs
        </RouterLink>
      </div>
    </div>
  </div>
</template>
