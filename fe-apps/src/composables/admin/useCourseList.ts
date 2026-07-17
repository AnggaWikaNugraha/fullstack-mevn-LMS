import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { adminListCourses, adminUpdateCourse, adminDeleteCourse } from '@/api/admin/courses';

export function useCourseList() {
  const qc = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => adminListCourses().then((r) => r.data.data!.courses),
  });

  const { mutate: togglePublish } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'draft' | 'published' }) =>
      adminUpdateCourse(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-courses'] }),
  });

  const { mutate: deleteCourse } = useMutation({
    mutationFn: (id: string) => adminDeleteCourse(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-courses'] }),
  });

  function confirmDelete(id: string, title: string) {
    if (confirm(`Hapus course "${title}"? Semua konten akan ikut terhapus.`)) {
      deleteCourse(id);
    }
  }

  return { courses, isLoading, togglePublish, confirmDelete };
}
