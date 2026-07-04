<script setup lang="ts">
import AppNavbar from '@/components/ui/AppNavbar.vue';
import AppFooter from '@/components/ui/AppFooter.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppNavbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
