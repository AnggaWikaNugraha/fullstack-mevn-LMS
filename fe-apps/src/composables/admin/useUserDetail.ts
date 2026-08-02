import { computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { adminGetUser, adminUpdateUserRole, type AdminUser } from '@/api/admin/users';

export const roleBadge: Record<AdminUser['role'], string> = {
  student:    'bg-gray-100 text-gray-600',
  instructor: 'bg-blue-100 text-blue-700',
  mentor:     'bg-emerald-100 text-emerald-700',
  admin:      'bg-red-100 text-red-700',
};

export const roleOptions: AdminUser['role'][] = ['student', 'instructor', 'mentor', 'admin'];

export function useUserDetail(userId: string) {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-user', userId],
    queryFn: () => adminGetUser(userId).then((r) => r.data.data!),
  });

  const user = computed(() => data.value?.user);
  const enrollments = computed(() => data.value?.enrollments ?? []);
  const orders = computed(() => data.value?.orders ?? []);
  const totalSpent = computed(() => data.value?.total_spent ?? 0);

  const { mutate: changeRole, isPending: changingRole } = useMutation({
    mutationFn: (role: AdminUser['role']) => adminUpdateUserRole(userId, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-user', userId] }),
  });

  return {
    user, enrollments, orders, totalSpent, isLoading,
    changeRole, changingRole,
  };
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

export const statusBadge: Record<string, string> = {
  paid:    'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-600',
  failed:  'bg-red-50 text-red-600',
  expired: 'bg-gray-100 text-gray-500',
};
