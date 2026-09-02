import { ref, shallowRef, computed, onBeforeUnmount } from 'vue';
import type {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
import { getSessionToken } from '@/api/bootcamps';
import type { LiveSessionToken } from '@/types/bootcamps';

export interface RemoteParticipant {
  uid: string | number;
  hasVideo: boolean;
  hasAudio: boolean;
}

export function useLiveSession(sessionId: string) {
  // Objek SDK bukan state reaktif — shallowRef mencegah Vue membungkusnya proxy,
  // yang bisa merusak internal SDK
  const client = shallowRef<IAgoraRTCClient | null>(null);
  const localAudio = shallowRef<IMicrophoneAudioTrack | null>(null);
  const localVideo = shallowRef<ICameraVideoTrack | null>(null);

  const meta = ref<LiveSessionToken | null>(null);
  const remoteUsers = ref<RemoteParticipant[]>([]);

  const joining = ref(false);
  const joined = ref(false);
  const errorMessage = ref<string | null>(null);

  const micOn = ref(true);
  const cameraOn = ref(true);

  const isHost = computed(() => meta.value?.role === 'host');
  const sessionName = computed(() => meta.value?.session.session_name ?? '');

  function syncRemote() {
    const list = client.value?.remoteUsers ?? [];
    remoteUsers.value = list.map((u) => ({
      uid: u.uid,
      hasVideo: !!u.videoTrack,
      hasAudio: !!u.audioTrack,
    }));
  }

  async function join() {
    if (joining.value || joined.value) return;
    joining.value = true;
    errorMessage.value = null;

    try {
      // Token diminta lebih dulu: server yang memutuskan boleh masuk atau tidak
      // (enrollment + kuota menit), jadi SDK tidak perlu dimuat kalau ditolak
      const res = await getSessionToken(sessionId);
      meta.value = res.data.data!;

      // Impor dinamis — SDK Agora besar dan hanya dipakai halaman ini
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      const rtc = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      client.value = rtc;

      rtc.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
        await rtc.subscribe(user, mediaType);
        if (mediaType === 'audio') user.audioTrack?.play();
        syncRemote();
      });
      rtc.on('user-unpublished', syncRemote);
      rtc.on('user-left', syncRemote);

      await rtc.join(meta.value.appId, meta.value.channelName, meta.value.token, meta.value.uid);

      const [mic, cam] = await AgoraRTC.createMicrophoneAndCameraTracks();
      localAudio.value = mic;
      localVideo.value = cam;
      await rtc.publish([mic, cam]);

      joined.value = true;
      syncRemote();
    } catch (err) {
      // Pesan 403 dari BE (belum terdaftar / kuota habis) ditampilkan apa adanya,
      // bukan error mentah SDK
      const api = err as { response?: { data?: { message?: string } } };
      errorMessage.value = api?.response?.data?.message
        ?? (err instanceof Error ? err.message : 'Gagal bergabung ke sesi.');
      await leave();
    } finally {
      joining.value = false;
    }
  }

  async function leave() {
    localAudio.value?.stop();
    localAudio.value?.close();
    localVideo.value?.stop();
    localVideo.value?.close();
    localAudio.value = null;
    localVideo.value = null;

    if (client.value) {
      client.value.removeAllListeners();
      await client.value.leave().catch(() => undefined);
      client.value = null;
    }

    remoteUsers.value = [];
    joined.value = false;
  }

  // SDK Agora memutar video ke elemen DOM, jadi view menyerahkan elemennya
  // lewat ref callback ketimbang composable menyentuh DOM sendiri
  function playLocalVideo(el: HTMLElement | null) {
    if (el && localVideo.value) localVideo.value.play(el);
  }

  function playRemoteVideo(uid: string | number, el: HTMLElement | null) {
    const user = client.value?.remoteUsers.find((u) => u.uid === uid);
    if (el && user?.videoTrack) user.videoTrack.play(el);
  }

  async function toggleMic() {
    if (!localAudio.value) return;
    micOn.value = !micOn.value;
    await localAudio.value.setEnabled(micOn.value);
  }

  async function toggleCamera() {
    if (!localVideo.value) return;
    cameraOn.value = !cameraOn.value;
    await localVideo.value.setEnabled(cameraOn.value);
  }

  // Menutup tab tidak memicu unmount, jadi kanal juga dilepas lewat pagehide
  const releaseOnUnload = () => { void leave(); };
  window.addEventListener('pagehide', releaseOnUnload);

  onBeforeUnmount(async () => {
    window.removeEventListener('pagehide', releaseOnUnload);
    await leave();
  });

  return {
    meta, isHost, sessionName,
    localVideo, remoteUsers,
    joining, joined, errorMessage,
    micOn, cameraOn,
    join, leave, toggleMic, toggleCamera,
    playLocalVideo, playRemoteVideo,
  };
}
