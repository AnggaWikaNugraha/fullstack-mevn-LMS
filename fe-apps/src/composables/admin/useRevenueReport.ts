import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { adminGetRevenueReport } from '@/api/admin/dashboard';

const NAMA_BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// Satu batang siap render — dipakai bersama oleh grafik course dan bootcamp
export interface RevenueChartBar {
  period: string;
  label: string;
  value: number;
  orders: number;
  percent: number;
}

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
  const topBootcamps = computed(() => data.value?.topBootcamps ?? []);
  const year = computed(() => data.value?.year ?? null);
  const availableYears = computed(() => data.value?.availableYears ?? []);

  // Course dan bootcamp tampil di dua grafik terpisah, tapi skalanya sengaja
  // disamakan — memakai nilai penggal tertinggi dari keduanya — supaya tinggi
  // batang antar grafik bisa dibandingkan langsung. Minimal 1 agar tidak bagi nol.
  const maxSegment = computed(() =>
    Math.max(1, ...series.value.flatMap((p) => [p.course_total, p.bootcamp_total]))
  );

  function toChartBars(jenis: 'course' | 'bootcamp'): RevenueChartBar[] {
    return series.value.map((point, i) => {
      const value = jenis === 'course' ? point.course_total : point.bootcamp_total;
      const orders = jenis === 'course' ? point.course_orders : point.bootcamp_orders;
      return {
        period: point.period,
        label: NAMA_BULAN[i],
        value,
        orders,
        percent: Math.round((value / maxSegment.value) * 100),
      };
    });
  }

  const courseBars = computed(() => toChartBars('course'));
  const bootcampBars = computed(() => toChartBars('bootcamp'));

  // Dipakai tiap grafik untuk memilih tampilan kosong atau batang
  const hasBootcampRevenue = computed(() => series.value.some((p) => p.bootcamp_total > 0));
  const hasCourseRevenue = computed(() => series.value.some((p) => p.course_total > 0));

  const hasData = computed(() => series.value.some((p) => p.total > 0));

  function selectYear(value: number) {
    selectedYear.value = value;
  }

  return {
    courseBars, bootcampBars, series, summary, topCourses, topBootcamps,
    hasBootcampRevenue, hasCourseRevenue,
    year, availableYears, selectYear,
    hasData, maxSegment,
    isLoading, isFetching, isError,
  };
}
