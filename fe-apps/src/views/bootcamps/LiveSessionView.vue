<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Mic, MicOff, Video, VideoOff, PhoneOff, ShieldCheck, Users } from '@lucide/vue';
import { useLiveSession } from '@/composables/bootcamps/useLiveSession';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const sessionId = route.params.sessionId as string;

const {
  meta, isHost, sessionName,
  remoteUsers,
  joining, joined, errorMessage,
  micOn, cameraOn,
  join, leave, toggleMic, toggleCamera,
  playLocalVideo, playRemoteVideo,
} = useLiveSession(sessionId);

onMounted(() => join());

async function handleLeave() {
  await leave();
  router.push('/my-bootcamps');
}
</script>

<template>
  <div class="min-h-[calc(100vh-64px)] bg-gray-900 text-white flex flex-col">
    <!-- Header -->
    <div class="flex items-center gap-3 px-5 py-3 border-b border-white/10">
      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold truncate">{{ sessionName || 'Live Session' }}</p>
        <p v-if="meta" class="text-xs text-gray-400">
          {{ meta.session.session_start_time }}–{{ meta.session.session_end_time }}
        </p>
      </div>
      <span
        v-if="joined && isHost"
        class="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-medium"
      >
        <ShieldCheck class="w-3.5 h-3.5" /> Mentor
      </span>
      <span v-if="joined" class="flex items-center gap-1.5 text-xs text-gray-400">
        <Users class="w-3.5 h-3.5" /> {{ remoteUsers.length + 1 }}
      </span>
    </div>

    <!-- Menghubungkan -->
    <div v-if="joining" class="flex-1 flex items-center justify-center text-sm text-gray-400">
      Menghubungkan ke sesi...
    </div>

    <!-- Ditolak / gagal — pesan dari BE ditampilkan apa adanya -->
    <div v-else-if="errorMessage" class="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <p class="text-gray-300 max-w-md">{{ errorMessage }}</p>
      <RouterLink
        to="/my-bootcamps"
        class="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors"
      >
        Kembali ke Bootcamp Saya
      </RouterLink>
    </div>

    <!-- Ruang sesi -->
    <template v-else-if="joined">
      <div class="flex-1 p-4 grid gap-3 auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Video sendiri -->
        <div class="relative rounded-2xl overflow-hidden bg-black ring-2 ring-indigo-500/40">
          <div :ref="(el) => playLocalVideo(el as HTMLElement)" class="w-full h-full min-h-40" />
          <div
            v-if="!cameraOn"
            class="absolute inset-0 flex items-center justify-center bg-gray-800 text-sm text-gray-400"
          >
            Kamera mati
          </div>
          <p class="absolute bottom-2 left-2 text-xs bg-black/60 px-2 py-1 rounded-lg">
            {{ auth.user?.name ?? 'Kamu' }} (kamu){{ isHost ? ' · mentor' : '' }}
          </p>
        </div>

        <!-- Peserta lain -->
        <div
          v-for="user in remoteUsers"
          :key="`${user.uid}-${user.hasVideo}`"
          class="relative rounded-2xl overflow-hidden bg-black"
        >
          <div :ref="(el) => playRemoteVideo(user.uid, el as HTMLElement)" class="w-full h-full min-h-40" />
          <div
            v-if="!user.hasVideo"
            class="absolute inset-0 flex items-center justify-center bg-gray-800 text-sm text-gray-400"
          >
            Kamera mati
          </div>
          <p class="absolute bottom-2 left-2 flex items-center gap-1.5 text-xs bg-black/60 px-2 py-1 rounded-lg">
            <MicOff v-if="!user.hasAudio" class="w-3 h-3 text-red-400" />
            Peserta {{ user.uid }}
          </p>
        </div>
      </div>

      <!-- Bilah kontrol -->
      <div class="flex items-center justify-center gap-3 px-5 py-4 border-t border-white/10">
        <button
          class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
          :class="micOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 hover:bg-red-600'"
          :title="micOn ? 'Matikan mikrofon' : 'Nyalakan mikrofon'"
          @click="toggleMic()"
        >
          <Mic v-if="micOn" class="w-5 h-5" />
          <MicOff v-else class="w-5 h-5" />
        </button>

        <button
          class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
          :class="cameraOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 hover:bg-red-600'"
          :title="cameraOn ? 'Matikan kamera' : 'Nyalakan kamera'"
          @click="toggleCamera()"
        >
          <Video v-if="cameraOn" class="w-5 h-5" />
          <VideoOff v-else class="w-5 h-5" />
        </button>

        <button
          class="h-12 px-5 rounded-full flex items-center gap-2 bg-red-500 hover:bg-red-600 text-sm font-semibold transition-colors"
          @click="handleLeave()"
        >
          <PhoneOff class="w-5 h-5" />
          {{ isHost ? 'Akhiri Sesi' : 'Keluar' }}
        </button>
      </div>
    </template>
  </div>
</template>
