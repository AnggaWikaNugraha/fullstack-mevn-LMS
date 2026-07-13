import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getMyCourses } from '@/api/enrollments';

export function useMyEnrollments() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-courses'],
    queryFn: () => getMyCourses().then((r) => r.data.data),
  });

  const courses = computed(() => (data.value?.courses ?? []).filter((c) => c.course != null));

  return {
    courses,
    isLoading,
    isError,
  };
}
