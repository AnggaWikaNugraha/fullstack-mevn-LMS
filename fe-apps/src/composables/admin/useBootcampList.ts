import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { adminListBootcamps, adminDeleteBootcamp } from '@/api/admin/bootcamps';

export function useBootcampList() {
  const qc = useQueryClient();

  const { data: packages, isLoading } = useQuery({
    queryKey: ['admin-bootcamps'],
    queryFn: () => adminListBootcamps().then((r) => r.data.data!.packages),
  });

  const { mutate: deleteBootcamp } = useMutation({
    mutationFn: (id: string) => adminDeleteBootcamp(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-bootcamps'] }),
  });

  function confirmDelete(id: string, title: string) {
    if (confirm(`Hapus bootcamp "${title}"? Semua batch dan sesi akan ikut terhapus.`)) {
      deleteBootcamp(id);
    }
  }

  return { packages, isLoading, confirmDelete };
}
