import { computed, ref, onScopeDispose } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getMyBootcampEnrollments } from '@/api/bootcamps';
import type { MyBootcampEnrollment, BootcampSession } from '@/types/bootcamps';

export function useMyBootcamps() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-bootcamps'],
    queryFn: () => getMyBootcampEnrollments().then((r) => r.data.data),
  });

  const bootcamps = computed(() => data.value?.bootcamps ?? []);

  // Yang sedang berjalan dan akan datang ditaruh di atas, yang selesai di bawah
  const active = computed(() => bootcamps.value.filter((b) => b.status !== 'finished'));
  const finished = computed(() => bootcamps.value.filter((b) => b.status === 'finished'));

  // Jam berjalan supaya tombol "Gabung Sesi" muncul dan hilang sendiri
  // tanpa perlu memuat ulang halaman
  const now = ref(Date.now());
  const ticker = setInterval(() => { now.value = Date.now(); }, 30_000);
  onScopeDispose(() => clearInterval(ticker));

  // Sesi yang sedang bisa dimasuki untuk satu enrollment, null bila tidak ada
  function liveSessionOf(item: MyBootcampEnrollment): BootcampSession | null {
    return item.sessions.find((session) => isSessionJoinable(session, now.value)) ?? null;
  }

  return { bootcamps, active, finished, isLoading, isError, liveSessionOf };
}

// Pintu masuk dibuka 15 menit sebelum jadwal supaya peserta sempat bersiap
const JOIN_GRACE_MS = 15 * 60 * 1000;

// session_date menyimpan harinya, sedangkan jamnya ada di session_start_time /
// session_end_time — keduanya digabung jadi rentang waktu lokal
function sessionWindow(session: BootcampSession): { start: number; end: number } {
  const day = new Date(session.session_date);
  const [startHour, startMinute] = session.session_start_time.split(':').map(Number);
  const [endHour, endMinute] = session.session_end_time.split(':').map(Number);
  const at = (hour: number, minute: number) =>
    new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour || 0, minute || 0).getTime();
  return { start: at(startHour, startMinute), end: at(endHour, endMinute) };
}

export function isSessionJoinable(session: BootcampSession, now: number = Date.now()): boolean {
  const { start, end } = sessionWindow(session);
  return now >= start - JOIN_GRACE_MS && now <= end;
}

export const bootcampStatusBadge: Record<MyBootcampEnrollment['status'], string> = {
  upcoming: 'bg-amber-50 text-amber-600',
  ongoing:  'bg-emerald-50 text-emerald-700',
  finished: 'bg-gray-100 text-gray-500',
};

export const bootcampStatusLabel: Record<MyBootcampEnrollment['status'], string> = {
  upcoming: 'Akan Dimulai',
  ongoing:  'Sedang Berjalan',
  finished: 'Selesai',
};

export const packageTypeLabel: Record<string, string> = {
  online: 'Online',
  offline: 'Offline',
  hybrid: 'Hybrid',
};

export function formatSessionDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
