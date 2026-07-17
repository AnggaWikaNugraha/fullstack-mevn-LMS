import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { adminGetCourse } from '@/api/admin/courses';

export function useCourseContent(courseId: string) {
  const qc = useQueryClient();

  const { data: course, isLoading } = useQuery({
    queryKey: ['admin-course', courseId],
    queryFn: () => adminGetCourse(courseId).then((r) => r.data.data!.course),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-course', courseId] });

  return { course, isLoading, invalidate };
}
