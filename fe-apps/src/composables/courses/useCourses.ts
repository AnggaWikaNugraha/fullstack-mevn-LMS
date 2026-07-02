import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getCourses, getTopics } from '@/api/courses';

export function useCourses() {
  const selectedTopic = ref('');

  const { data: coursesData, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => getCourses(),
  });

  const { data: topicsData, isLoading: isLoadingTopics } = useQuery({
    queryKey: ['topics'],
    queryFn: () => getTopics(),
  });

  const allCourses = computed(() => coursesData.value?.data.data?.courses ?? []);
  const topics = computed(() => topicsData.value?.data.data?.topics ?? []);

  // Client-side filter — no refetch on topic pill click
  const filteredCourses = computed(() => {
    if (!selectedTopic.value) return allCourses.value;
    return allCourses.value.filter((c) => c.topic === selectedTopic.value);
  });

  function selectTopic(topic: string) {
    // Toggle off if clicking the already selected topic
    selectedTopic.value = selectedTopic.value === topic ? '' : topic;
  }

  return {
    filteredCourses,
    topics,
    selectedTopic,
    selectTopic,
    isLoadingCourses,
    isLoadingTopics,
  };
}
