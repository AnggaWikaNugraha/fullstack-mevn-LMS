<script setup lang="ts">
// Split-screen auth layout:
// Left panel  — branding/illustration (hidden on mobile)
// Right panel — form content via <RouterView />
</script>

<template>
  <div class="min-h-screen flex">

    <!-- Left panel — visible on lg+ screens only -->
    <div class="hidden lg:flex lg:w-[45%] relative bg-indigo-600 flex-col justify-between p-14 text-white overflow-hidden">

      <!-- Decorative circles -->
      <div class="absolute -top-16 -left-16 w-64 h-64 bg-indigo-500 rounded-full opacity-40"></div>
      <div class="absolute top-1/3 -right-12 w-48 h-48 bg-indigo-400 rounded-full opacity-30"></div>
      <div class="absolute -bottom-10 left-1/4 w-72 h-72 bg-indigo-700 rounded-full opacity-50"></div>

      <!-- Logo -->
      <div class="relative z-10 text-xl font-bold tracking-tight">SkilLine</div>

      <!-- Headline -->
      <div class="relative z-10">
        <h1 class="text-4xl font-bold leading-snug mb-4">
          Learn anything,<br />anytime, anywhere.
        </h1>
        <p class="text-indigo-200 text-base leading-relaxed">
          Join thousands of students growing<br />their skills every day.
        </p>
      </div>

      <!-- Testimonial card -->
      <div class="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
        <p class="text-sm text-indigo-100 leading-relaxed mb-3">
          "This platform completely changed how I learn. The courses are structured perfectly."
        </p>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-800 text-xs font-bold">A</div>
          <div>
            <p class="text-xs font-semibold">Alex Johnson</p>
            <p class="text-xs text-indigo-300">Web Developer</p>
          </div>
        </div>
      </div>

      <p class="relative z-10 text-indigo-400 text-xs">© 2026 SkilLine. All rights reserved.</p>
    </div>

    <!-- Right panel — form area -->
    <div class="flex-1 flex items-center justify-center bg-gray-50 p-6">
      <div class="w-full max-w-md">

        <!-- Mobile-only logo -->
        <div class="lg:hidden text-center mb-10">
          <span class="text-2xl font-bold text-indigo-600">SkilLine</span>
        </div>

        <!-- Form card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10">
          <RouterView />
        </div>

        <p class="text-center text-xs text-gray-400 mt-6">© 2026 SkilLine. All rights reserved.</p>
      </div>
    </div>

  </div>
</template>
