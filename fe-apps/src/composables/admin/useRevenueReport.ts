import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { adminGetRevenueReport } from '@/api/admin/dashboard';

const NAMA_BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function useRevenueReport() {
  // Nilai awal null berarti "ikuti tahun berjalan versi backend",
  // supaya FE tidak menebak tahun dari jam perangkat pengguna
  const selectedYear = ref<number | null>(null);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: computed(() => ['admin-revenue', selectedYear.value]),
    queryFn: () =>
      adminGetRevenueReport(selectedYear.value ? { year: selectedYear.value } : undefined)
        .then((r) => r.data.data!),
    // Tahan data tahun sebelumnya selama tahun baru dimuat agar grafik tidak berkedip
    placeholderData: (prev) => prev,
  });

  const series = computed(() => data.value?.series ?? []);
  const summary = computed(() => data.value?.summary);
  const topCourses = computed(() => data.value?.topCourses ?? []);
  const year = computed(() => data.value?.year ?? null);
  const availableYears = computed(() => data.value?.availableYears ?? []);

  // Nilai bulan tertinggi dipakai sebagai acuan tinggi batang.
  // Saat semua bulan nol, pakai 1 supaya tidak terjadi pembagian nol.
  const maxTotal = computed(() => Math.max(1, ...series.value.map((p) => p.total)));

  const bars = computed(() =>
    series.value.map((point, i) => ({
      ...point,
      label: NAMA_BULAN[i],
      heightPercent: Math.round((point.total / maxTotal.value) * 100),
    }))
  );

  const hasData = computed(() => series.value.some((p) => p.total > 0));

  function selectYear(value: number) {
    selectedYear.value = value;
  }

  return {
    bars, series, summary, topCourses,
    year, availableYears, selectYear,
    hasData, maxTotal,
    isLoading, isFetching, isError,
  };
}
