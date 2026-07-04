<script setup lang="ts">
// Konten statis — 3 blok benefit dengan layout gambar & teks bergantian
const benefits = [
  {
    tag: 'Bootcamp',
    title: 'Learn by Doing,\nBukan Sekadar Teori',
    description:
      'Program bootcamp kami dirancang berbasis proyek nyata. Kamu akan membangun portfolio yang bisa langsung ditunjukkan ke perusahaan, didampingi mentor berpengalaman dari industri.',
    cta: 'Lihat Bootcamp',
    ctaLink: '/bootcamp',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    imageAlt: 'Tim sedang berkolaborasi pada proyek coding',
    imageLeft: false,
  },
  {
    tag: 'Mentoring',
    title: 'Belajar Lebih Cepat\ndengan Personal Mentor',
    description:
      'Setiap peserta mendapatkan mentor pribadi yang siap membantu kapanpun kamu stuck. Bukan sekadar forum — tapi bimbingan langsung dari praktisi yang bekerja di perusahaan top.',
    cta: 'Kenali Mentor Kami',
    ctaLink: '/bootcamp',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    imageAlt: 'Mentor sedang membimbing peserta belajar',
    imageLeft: true,
  },
  {
    tag: 'Kursus',
    title: 'Ratusan Kursus\nuntuk Semua Level',
    description:
      'Dari Web Development, Mobile, hingga Data Science — semua tersedia. Mulai dari yang gratis untuk pemula hingga materi lanjutan untuk profesional yang ingin naik level.',
    cta: 'Jelajahi Kursus',
    ctaLink: '/',
    image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80',
    imageAlt: 'Seseorang belajar online dengan laptop',
    imageLeft: false,
  },
];
</script>

<template>
  <section class="py-16 lg:py-24 bg-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      <div
        v-for="(benefit, index) in benefits"
        :key="index"
        class="flex flex-col gap-10 lg:gap-16"
        :class="benefit.imageLeft ? 'lg:flex-row-reverse' : 'lg:flex-row'"
      >
        <!-- Gambar -->
        <div class="lg:w-1/2">
          <div class="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100">
            <img
              :src="benefit.image"
              :alt="benefit.imageAlt"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Teks -->
        <div class="lg:w-1/2 flex flex-col justify-center">
          <span class="inline-block text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">
            {{ benefit.tag }}
          </span>
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight whitespace-pre-line">
            {{ benefit.title }}
          </h2>
          <p class="mt-4 text-gray-500 leading-relaxed">
            {{ benefit.description }}
          </p>
          <RouterLink
            :to="benefit.ctaLink"
            class="mt-6 self-start inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {{ benefit.cta }}
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
