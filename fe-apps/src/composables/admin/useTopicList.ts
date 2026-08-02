import { ref } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import {
  adminListTopics, adminCreateTopic, adminUpdateTopic, adminDeleteTopic,
  type AdminTopic, type TopicPayload,
} from '@/api/admin/topics';

export function useTopicList() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-topics'],
    queryFn: () => adminListTopics().then((r) => r.data.data!.topics),
  });

  const topics = data;

  // ── Form tambah topik baru ──────────────────────────────────────────────────
  const showAddForm = ref(false);
  const newTopic = ref<TopicPayload>({ slug: '', name: '' });

  const { mutate: createTopic, isPending: creating } = useMutation({
    mutationFn: () => adminCreateTopic(newTopic.value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-topics'] });
      newTopic.value = { slug: '', name: '' };
      showAddForm.value = false;
    },
  });

  // ── Edit topik ─────────────────────────────────────────────────────────────
  const editingTopic = ref<AdminTopic | null>(null);

  function startEdit(topic: AdminTopic) {
    editingTopic.value = { ...topic };
  }
  function cancelEdit() {
    editingTopic.value = null;
  }

  const { mutate: saveTopic, isPending: saving } = useMutation({
    mutationFn: () => adminUpdateTopic(editingTopic.value!._id, {
      slug: editingTopic.value!.slug,
      name: editingTopic.value!.name,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-topics'] });
      editingTopic.value = null;
    },
  });

  // ── Hapus topik ────────────────────────────────────────────────────────────
  const { mutate: removeTopic, isPending: deleting } = useMutation({
    mutationFn: (id: string) => adminDeleteTopic(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-topics'] }),
  });

  function confirmDelete(topic: AdminTopic) {
    if (confirm(`Hapus topik "${topic.name}"?`)) removeTopic(topic._id);
  }

  return {
    topics, isLoading,
    showAddForm, newTopic, creating, createTopic,
    editingTopic, startEdit, cancelEdit, saving, saveTopic,
    deleting, confirmDelete,
  };
}
