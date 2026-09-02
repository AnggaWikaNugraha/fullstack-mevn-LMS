import { ref, computed, useTemplateRef } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getCertificate } from '@/api/courses';

export function useCertificate(courseId: string) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['certificate', courseId],
    queryFn: () => getCertificate(courseId).then((r) => r.data.data!),
    // 403 (belum lulus) adalah jawaban yang sah, bukan kegagalan jaringan
    retry: false,
  });

  const certificate = computed(() => data.value ?? null);

  // Pesan dari BE dipakai apa adanya agar alasan penolakan tetap spesifik
  const errorMessage = computed(() => {
    const err = error.value as { response?: { data?: { message?: string } } } | null;
    return err?.response?.data?.message ?? 'Sertifikat tidak dapat dimuat.';
  });

  // Elemen sertifikat yang akan dipotret jadi PDF — dipasang di template
  // sebagai <div ref="sheet">
  const sheetRef = useTemplateRef<HTMLElement>('sheet');
  const downloading = ref(false);

  async function downloadPdf() {
    if (!sheetRef.value || !certificate.value) return;
    downloading.value = true;
    try {
      // Impor dinamis supaya kedua pustaka tidak ikut bundel halaman lain
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(sheetRef.value, { scale: 2, backgroundColor: '#ffffff' });
      const image = canvas.toDataURL('image/png');

      // Lanskap A4; tinggi gambar diskalakan agar rasionya tidak berubah
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageHeight = (canvas.height * pageWidth) / canvas.width;
      const offsetY = imageHeight < pageHeight ? (pageHeight - imageHeight) / 2 : 0;

      pdf.addImage(image, 'PNG', 0, offsetY, pageWidth, imageHeight);
      pdf.save(`sertifikat-${slugify(certificate.value.courseName)}.pdf`);
    } finally {
      downloading.value = false;
    }
  }

  return { certificate, isLoading, isError, errorMessage, sheetRef, downloading, downloadPdf };
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function formatCertificateDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
