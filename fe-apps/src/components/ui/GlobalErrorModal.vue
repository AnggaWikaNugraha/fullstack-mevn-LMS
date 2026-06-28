<script setup lang="ts">
import { useErrorStore } from '@/stores/errorStore';
import { WifiOff } from '@lucide/vue';

const errorStore = useErrorStore();
</script>

<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="errorStore.visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="errorStore.hide()"
    >
      <!-- Modal card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
        <div class="flex justify-center mb-4">
          <div class="bg-red-100 rounded-full p-4">
            <WifiOff class="text-red-500 w-8 h-8" />
          </div>
        </div>

        <h2 class="text-lg font-semibold text-gray-900 mb-2">Connection Error</h2>
        <p class="text-gray-500 text-sm mb-6">{{ errorStore.message }}</p>

        <button
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-colors"
          @click="errorStore.hide()"
        >
          Try Again
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
