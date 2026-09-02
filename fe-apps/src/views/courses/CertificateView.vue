<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ArrowLeft, Download, Award } from '@lucide/vue';
import { useCertificate, formatCertificateDate } from '@/composables/courses/useCertificate';

const route = useRoute();
const courseId = route.params.id as string;

const {
  certificate, isLoading, isError, errorMessage,
  downloading, downloadPdf,
} = useCertificate(courseId);
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4 mb-8">
      <RouterLink
        :to="`/courses/${courseId}`"
        class="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" /> Kembali ke course
      </RouterLink>

      <button
        v-if="certificate"
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 transition-colors"
        :disabled="downloading"
        @click="downloadPdf()"
      >
        <Download class="w-4 h-4" />
        {{ downloading ? 'Menyiapkan PDF...' : 'Download PDF' }}
      </button>
    </div>

    <!-- Memuat -->
    <div v-if="isLoading" class="py-20 text-center text-sm text-gray-400">Memuat sertifikat...</div>

    <!-- Belum lulus / gagal — pesan datang dari BE -->
    <div v-else-if="isError || !certificate" class="py-16 text-center">
      <Award class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-600 mb-1">{{ errorMessage }}</p>
      <RouterLink
        :to="`/courses/${courseId}`"
        class="inline-block mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
      >
        Lanjut Belajar
      </RouterLink>
    </div>

    <!-- Lembar sertifikat — elemen inilah yang dipotret jadi PDF -->
    <div v-else class="overflow-x-auto">
      <div
        ref="sheet"
        class="mx-auto bg-white text-center"
        style="width: 1000px; padding: 56px 64px; border: 10px solid #4f46e5; outline: 2px solid #c7d2fe; outline-offset: -22px;"
      >
        <p class="text-sm tracking-[0.35em] text-indigo-600 font-semibold uppercase">SkilLine</p>
        <p class="mt-6 text-3xl font-bold tracking-wide text-gray-900">SERTIFIKAT KELULUSAN</p>
        <p class="mt-2 text-sm text-gray-500">Diberikan dengan bangga kepada</p>

        <p class="mt-8 text-4xl font-bold text-indigo-700">{{ certificate.userName }}</p>

        <p class="mt-8 text-sm text-gray-500">atas keberhasilannya menyelesaikan seluruh materi kursus</p>
        <p class="mt-3 text-2xl font-semibold text-gray-900">{{ certificate.courseName }}</p>
        <p class="mt-2 text-sm text-gray-500">
          sebanyak {{ certificate.totalLessons }} pelajaran, diselesaikan pada
          {{ formatCertificateDate(certificate.completedAt) }}
        </p>

        <!-- Kaki sertifikat -->
        <div class="mt-14 flex items-end justify-between text-left">
          <div>
            <p class="text-xs text-gray-400 mb-1">Nomor Sertifikat</p>
            <p class="text-xs font-mono text-gray-700">{{ certificate.certificateId }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-400 mb-1">Diterbitkan</p>
            <p class="text-xs text-gray-700">{{ formatCertificateDate(certificate.issuedAt) }}</p>
          </div>
        </div>
      </div>

      <p class="text-center text-xs text-gray-400 mt-4">
        Nomor sertifikat di atas dapat dipakai untuk verifikasi keaslian.
      </p>
    </div>
  </div>
</template>
