import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { adminGetCourse, adminCreateCourse, adminUpdateCourse, type CoursePayload } from '@/api/admin/courses';

export function useCourseForm(courseId: string | undefined) {
  const qc = useQueryClient();

  const { data: courseData, isLoading: loadingCourse } = useQuery({
    queryKey: ['admin-course', courseId],
    queryFn: () => adminGetCourse(courseId!).then((r) => r.data.data!.course),
    enabled: !!courseId,
  });

  const { mutate: createCourse, isPending: creating } = useMutation({
    mutationFn: (payload: CoursePayload) => adminCreateCourse(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-courses'] }),
  });

  const { mutate: updateCourse, isPending: updating } = useMutation({
    mutationFn: (payload: Partial<CoursePayload & { status: 'draft' | 'published' }>) =>
      adminUpdateCourse(courseId!, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-courses'] });
      qc.invalidateQueries({ queryKey: ['admin-course', courseId] });
    },
  });

  return { courseData, loadingCourse, createCourse, updateCourse, creating, updating };
}
