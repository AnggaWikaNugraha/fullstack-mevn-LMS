<script setup lang="ts">
import AppNavbar from '@/components/ui/AppNavbar.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppNavbar />
    <main>
      <RouterView />
    </main>
  </div>
</template>
