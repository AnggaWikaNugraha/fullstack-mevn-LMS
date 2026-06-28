import { defineStore } from 'pinia';
import { ref } from 'vue';

// Global error store — drives the GlobalErrorModal shown on network/server errors
export const useErrorStore = defineStore('error', () => {
  const visible = ref(false);
  const message = ref('');

  function show(msg: string) {
    message.value = msg;
    visible.value = true;
  }

  function hide() {
    visible.value = false;
    message.value = '';
  }

  return { visible, message, show, hide };
});
