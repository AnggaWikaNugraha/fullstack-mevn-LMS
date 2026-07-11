export const formatRupiah = (price: number): string =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

export const formatDate = (dateStr: string): string =>
  new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr));

export const progressPercent = (completed: number, total: number): number =>
  total ? Math.round((completed / total) * 100) : 0;
