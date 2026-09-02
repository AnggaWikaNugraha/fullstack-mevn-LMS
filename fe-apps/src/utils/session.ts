// Pintu masuk sesi dibuka 15 menit sebelum jadwal supaya peserta sempat bersiap
const JOIN_GRACE_MS = 15 * 60 * 1000;

// Bentuk minimal yang dibutuhkan — cocok untuk tipe sesi sisi user maupun admin
export interface SchedulableSession {
  session_date: string;
  session_start_time: string;  // "HH:mm"
  session_end_time: string;    // "HH:mm"
}

// session_date menyimpan harinya, sedangkan jamnya ada di session_start_time /
// session_end_time — keduanya digabung jadi rentang waktu lokal
function sessionWindow(session: SchedulableSession): { start: number; end: number } {
  const day = new Date(session.session_date);
  const [startHour, startMinute] = session.session_start_time.split(':').map(Number);
  const [endHour, endMinute] = session.session_end_time.split(':').map(Number);
  const at = (hour: number, minute: number) =>
    new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour || 0, minute || 0).getTime();
  return { start: at(startHour, startMinute), end: at(endHour, endMinute) };
}

export function isSessionJoinable(session: SchedulableSession, now: number = Date.now()): boolean {
  const { start, end } = sessionWindow(session);
  return now >= start - JOIN_GRACE_MS && now <= end;
}
