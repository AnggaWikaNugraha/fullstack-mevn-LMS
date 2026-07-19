import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { adminGetBootcamp } from '@/api/admin/bootcamps';

export function useBootcampContent(packageId: string) {
  const qc = useQueryClient();

  const { data: pkg, isLoading } = useQuery({
    queryKey: ['admin-bootcamp', packageId],
    queryFn: () => adminGetBootcamp(packageId).then((r) => r.data.data!.package),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-bootcamp', packageId] });

  return { pkg, isLoading, invalidate };
}
