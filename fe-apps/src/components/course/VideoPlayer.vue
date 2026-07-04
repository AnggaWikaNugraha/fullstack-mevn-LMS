<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

// Tambahkan tipe global untuk YouTube IFrame API
declare global {
  interface Window {
    YT: {
      Player: new (el: HTMLElement, config: object) => YTPlayer;
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  loadVideoById(videoId: string): void;
  destroy(): void;
}

const props = defineProps<{
  videoUrl: string | null;
  isLocked?: boolean;
}>();

const emit = defineEmits<{ ended: [] }>();

const playerContainer = ref<HTMLElement | null>(null);
let player: YTPlayer | null = null;
let apiReady = false;

function extractVideoId(url: string): string {
  // Format yang diharapkan: https://www.youtube.com/embed/VIDEO_ID
  return url.split('/embed/')[1]?.split('?')[0] ?? '';
}

function createPlayer() {
  if (!playerContainer.value || !props.videoUrl || props.isLocked) return;

  player = new window.YT.Player(playerContainer.value, {
    videoId: extractVideoId(props.videoUrl),
    playerVars: { rel: 0, modestbranding: 1, enablejsapi: 1 },
    events: {
      onStateChange: (event: { data: number }) => {
        if (event.data === window.YT.PlayerState.ENDED) {
          emit('ended');
        }
      },
    },
  });
}

function loadYouTubeApi() {
  if (document.getElementById('yt-iframe-api')) {
    // Script sudah di-inject oleh instance VideoPlayer sebelumnya
    if (window.YT?.Player) {
      apiReady = true;
      createPlayer();
    }
    return;
  }

  const tag = document.createElement('script');
  tag.id = 'yt-iframe-api';
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);

  window.onYouTubeIframeAPIReady = () => {
    apiReady = true;
    createPlayer();
  };
}

// Ganti video saat lesson berubah tanpa destroy dan recreate player
watch(
  () => props.videoUrl,
  (newUrl) => {
    if (!newUrl || props.isLocked) return;
    if (player && apiReady) {
      player.loadVideoById(extractVideoId(newUrl));
    } else if (apiReady) {
      createPlayer();
    }
  }
);

onMounted(() => {
  if (props.isLocked) return;
  loadYouTubeApi();
});

onUnmounted(() => {
  player?.destroy();
  player = null;
});
</script>

<template>
  <div class="relative w-full bg-black rounded-xl overflow-hidden" style="aspect-ratio: 16/9">
    <!-- Kontainer player YouTube — diganti oleh YT.Player saat mount -->
    <div ref="playerContainer" class="w-full h-full"></div>

    <!-- Overlay terkunci -->
    <div
      v-if="isLocked"
      class="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white gap-3"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
      <p class="text-sm text-gray-300">Selesaikan pelajaran sebelumnya untuk membuka video ini</p>
    </div>
  </div>
</template>
