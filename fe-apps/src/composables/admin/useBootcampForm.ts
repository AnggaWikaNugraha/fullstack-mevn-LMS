import { ref, watch } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import {
  adminGetBootcamp, adminCreateBootcamp, adminUpdateBootcamp, adminListMentors,
  type PackagePayload, type AdminMentorPayload,
} from '@/api/admin/bootcamps';

const emptyForm = (): PackagePayload => ({
  title: '',
  description: '',
  image_url: '',
  status: 'coming_soon',
  mentors: [],
});

export function useBootcampForm(packageId?: string) {
  const router = useRouter();
  const qc = useQueryClient();
  const form = ref(emptyForm());

  // Daftar semua user mentor (untuk dropdown picker)
  const { data: availableMentors } = useQuery({
    queryKey: ['admin-mentor-list'],
    queryFn: () => adminListMentors().then((r) => r.data.data!.mentors),
  });

  // Pre-fill saat edit — mentors di-convert ke payload format (userId string)
  const { data: existing } = useQuery({
    queryKey: ['admin-bootcamp', packageId],
    queryFn: () => adminGetBootcamp(packageId!).then((r) => r.data.data!.package),
    enabled: !!packageId,
  });

  watch(existing, (val) => {
    if (!val) return;
    form.value = {
      title: val.title,
      description: val.description,
      image_url: val.image_url,
      status: val.status,
      // Konversi dari populated object ke payload
      mentors: val.mentors.map((m) => ({
        userId: m.userId._id,
        occupation: m.occupation,
      })),
    };
  }, { immediate: true });

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: () => packageId
      ? adminUpdateBootcamp(packageId, form.value)
      : adminCreateBootcamp(form.value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-bootcamps'] });
      router.push('/admin/bootcamps');
    },
  });

  // Toggle mentor: tambah jika belum dipilih, hapus jika sudah ada
  function toggleMentor(userId: string) {
    const idx = form.value.mentors.findIndex((m) => m.userId === userId);
    if (idx >= 0) {
      form.value.mentors.splice(idx, 1);
    } else {
      form.value.mentors.push({ userId, occupation: '' });
    }
  }

  function isMentorSelected(userId: string): boolean {
    return form.value.mentors.some((m) => m.userId === userId);
  }

  function updateOccupation(userId: string, occupation: string) {
    const m = form.value.mentors.find((m) => m.userId === userId);
    if (m) m.occupation = occupation;
  }

  function getMentorPayload(userId: string): AdminMentorPayload | undefined {
    return form.value.mentors.find((m) => m.userId === userId);
  }

  return {
    form, saving, save,
    availableMentors,
    toggleMentor, isMentorSelected, updateOccupation, getMentorPayload,
  };
}
