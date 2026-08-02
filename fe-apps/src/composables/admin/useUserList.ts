import { ref, computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { adminListUsers, adminUpdateUserRole, type AdminUser } from '@/api/admin/users';

export function useUserList() {
  const qc = useQueryClient();
  const search = ref('');
  const page = ref(1);

  const { data, isLoading } = useQuery({
    queryKey: computed(() => ['admin-users', search.value, page.value]),
    queryFn: () => adminListUsers({ page: page.value, limit: 20, search: search.value || undefined })
      .then((r) => r.data.data!),
  });

  const users = computed(() => data.value?.users ?? []);
  const pagination = computed(() => data.value?.pagination);

  function setSearch(val: string) {
    search.value = val;
    page.value = 1;
  }

  // ── Ubah role user ──────────────────────────────────────────────────────────
  const { mutate: changeRole, isPending: changingRole } = useMutation({
    mutationFn: ({ id, role }: { id: string; role: AdminUser['role'] }) =>
      adminUpdateUserRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  return {
    users, pagination, isLoading,
    search, setSearch, page,
    changeRole, changingRole,
  };
}
