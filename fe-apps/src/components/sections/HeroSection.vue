<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ChevronLeft, ChevronRight } from '@lucide/vue';

const slides = [
  {
    id: 1,
    title: 'Start Your Learning Journey',
    subtitle: 'Explore hundreds of courses taught by industry experts.',
    cta: 'Browse Courses',
    to: '/',
    bg: 'from-indigo-600 to-violet-600',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200',
  },
  {
    id: 2,
    title: 'Join Our Bootcamp',
    subtitle: 'Intensive programs with mentors to get you job-ready.',
    cta: 'See Bootcamps',
    to: '/bootcamps',
    bg: 'from-sky-500 to-indigo-600',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200',
  },
  {
    id: 3,
    title: 'Learn at Your Own Pace',
    subtitle: 'Free and premium courses available for all skill levels.',
    cta: 'Get Started',
    to: '/auth/register',
    bg: 'from-violet-600 to-pink-500',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200',
  },
];

const current = ref(0);
let timer: ReturnType<typeof setInterval>;

function next() {
  current.value = (current.value + 1) % slides.length;
}

function prev() {
  current.value = (current.value - 1 + slides.length) % slides.length;
}

function goTo(index: number) {
  current.value = index;
}

// Auto-advance every 5 seconds, reset on manual navigation
function startTimer() {
  timer = setInterval(next, 5000);
}

function resetTimer() {
  clearInterval(timer);
  startTimer();
}

onMounted(startTimer);
onUnmounted(() => clearInterval(timer));
</script>

<template>
  <div class="relative overflow-hidden h-[420px] md:h-[480px]">
    <!-- Slides -->
    <div
      v-for="(slide, index) in slides"
      :key="slide.id"
      class="absolute inset-0 transition-opacity duration-700"
      :class="index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'"
    >
      <!-- Background image with overlay -->
      <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-r opacity-80" :class="slide.bg" />

      <!-- Content -->
      <div class="absolute inset-0 flex flex-col items-start justify-center max-w-7xl mx-auto px-6 md:px-10">
        <h1 class="text-3xl md:text-5xl font-bold text-white mb-3 max-w-xl leading-tight">
          {{ slide.title }}
        </h1>
        <p class="text-white/80 text-base md:text-lg mb-6 max-w-md">
          {{ slide.subtitle }}
        </p>
        <RouterLink
          :to="slide.to"
          class="bg-white text-indigo-700 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
        >
          {{ slide.cta }}
        </RouterLink>
      </div>
    </div>

    <!-- Prev / Next arrows -->
    <button
      class="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
      @click="prev(); resetTimer()"
    >
      <ChevronLeft class="w-5 h-5" />
    </button>
    <button
      class="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
      @click="next(); resetTimer()"
    >
      <ChevronRight class="w-5 h-5" />
    </button>

    <!-- Dots -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
      <button
        v-for="(_, index) in slides"
        :key="index"
        class="w-2 h-2 rounded-full transition-all"
        :class="index === current ? 'bg-white w-5' : 'bg-white/50'"
        @click="goTo(index); resetTimer()"
      />
    </div>
  </div>
</template>
