// Semua pengelompokan waktu di laporan dan kuota memakai jam WIB, bukan UTC
// bawaan MongoDB. Tanpa ini pembayaran pukul 06:00 WIB tanggal 1 akan terhitung
// di bulan sebelumnya.
export const TIMEZONE = 'Asia/Jakarta';

// WIB tetap UTC+7 sepanjang tahun, tidak ada penyesuaian musim
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

// Mengubah waktu dinding WIB menjadi Date UTC yang setara, untuk dipakai di $match
export function wibToUtc(year: number, monthIndex: number, day = 1): Date {
  return new Date(Date.UTC(year, monthIndex, day) - WIB_OFFSET_MS);
}

// Tahun dan bulan saat ini menurut jam WIB, bukan zona waktu server
export function nowInWib(): { year: number; monthIndex: number } {
  const wib = new Date(Date.now() + WIB_OFFSET_MS);
  return { year: wib.getUTCFullYear(), monthIndex: wib.getUTCMonth() };
}

// Awal bulan berjalan menurut WIB — dipakai laporan bulanan dan rem kuota Agora
export function startOfCurrentWibMonth(): Date {
  const { year, monthIndex } = nowInWib();
  return wibToUtc(year, monthIndex);
}
