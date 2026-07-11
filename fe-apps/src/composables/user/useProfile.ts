import { ref } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { getProfile, updateProfile, changePassword } from '@/api/users';
import { useAuthStore } from '@/stores/authStore';
import type { UpdateProfilePayload, ChangePasswordPayload } from '@/types/auth';

export function useProfile() {
  const auth = useAuthStore();
  const queryClient = useQueryClient();

  const profileError = ref('');
  const profileSuccess = ref('');
  const passwordError = ref('');
  const passwordSuccess = ref('');

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile().then((r) => r.data.data),
  });

  const { isPending: isUpdatingProfile, mutate: submitProfile } = useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      updateProfile(payload).then((r) => r.data.data!),
    onSuccess: (data) => {
      // Sinkronkan user di authStore dan localStorage agar navbar terupdate
      auth.setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      profileSuccess.value = 'Profil berhasil diperbarui.';
      profileError.value = '';
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      profileError.value = err.response?.data?.message ?? 'Gagal memperbarui profil.';
      profileSuccess.value = '';
    },
  });

  const { isPending: isChangingPassword, mutate: submitChangePassword } = useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: () => {
      passwordSuccess.value = 'Password berhasil diubah.';
      passwordError.value = '';
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      passwordError.value = err.response?.data?.message ?? 'Gagal mengubah password.';
      passwordSuccess.value = '';
    },
  });

  return {
    data,
    isLoading,
    profileError,
    profileSuccess,
    passwordError,
    passwordSuccess,
    isUpdatingProfile,
    isChangingPassword,
    submitProfile,
    submitChangePassword,
  };
}
