// Loader snap.js Midtrans — dipakai bersama checkout course dan bootcamp.
// Script hanya boleh disuntik satu kali; pemanggilan berikutnya langsung resolve.
export function loadSnapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById('midtrans-snap')) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = 'midtrans-snap';
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY ?? '');
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Gagal memuat Midtrans Snap'));
    document.head.appendChild(script);
  });
}
