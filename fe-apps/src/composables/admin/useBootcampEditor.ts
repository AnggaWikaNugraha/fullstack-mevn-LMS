import { ref } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import {
  adminCreateBatch, adminUpdateBatch, adminDeleteBatch,
  adminCreateSession, adminUpdateSession, adminDeleteSession,
  type AdminBootcampBatch, type AdminBootcampSession,
  type BatchPayload, type SessionPayload,
} from '@/api/admin/bootcamps';
import { useBootcampContent } from './useBootcampContent';

const emptyBatch = (): BatchPayload => ({
  title: '',
  sub_title: '',
  description: '',
  started_at: '',
  ended_at: '',
  quota_used_percentage: 0,
  price: 0,
  strikethrough_price: 0,
  package_type: 'online',
});

const emptySession = (): SessionPayload => ({
  title: '',
  session_name: '',
  session_date: '',
  session_start_time: '',
  session_end_time: '',
});

export function useBootcampEditor(packageId: string) {
  const { pkg, isLoading, invalidate } = useBootcampContent(packageId);

  // Expand state per batch — buat Set baru agar Vue melacak perubahan
  const expandedBatches = ref<Set<string>>(new Set());
  const toggleBatch = (id: string) => {
    const s = new Set(expandedBatches.value);
    s.has(id) ? s.delete(id) : s.add(id);
    expandedBatches.value = s;
  };
  const expandAll = () => {
    expandedBatches.value = new Set(pkg.value?.batches.map((b) => b._id) ?? []);
  };
  const collapseAll = () => {
    expandedBatches.value = new Set();
  };

  // Form state
  const newBatch = ref(emptyBatch());
  const showAddBatch = ref(false);
  const editingBatch = ref<AdminBootcampBatch | null>(null);

  const newSession = ref<Record<string, SessionPayload>>({});
  const editingSession = ref<AdminBootcampSession | null>(null);

  // ── Batch mutations ──────────────────────────────────────────────────────────

  const { mutate: addBatch, isPending: addingBatch } = useMutation({
    mutationFn: () => adminCreateBatch(packageId, newBatch.value),
    onSuccess: () => {
      invalidate();
      newBatch.value = emptyBatch();
      showAddBatch.value = false;
    },
  });

  const { mutate: saveBatch, isPending: savingBatch } = useMutation({
    mutationFn: () => adminUpdateBatch(editingBatch.value!._id, {
      title: editingBatch.value!.title,
      sub_title: editingBatch.value!.sub_title,
      description: editingBatch.value!.description,
      started_at: editingBatch.value!.started_at,
      ended_at: editingBatch.value!.ended_at,
      quota_used_percentage: editingBatch.value!.quota_used_percentage,
      price: editingBatch.value!.price,
      strikethrough_price: editingBatch.value!.strikethrough_price,
      package_type: editingBatch.value!.package_type,
    }),
    onSuccess: () => { invalidate(); editingBatch.value = null; },
  });

  const { mutate: removeBatch } = useMutation({
    mutationFn: (id: string) => adminDeleteBatch(id),
    onSuccess: invalidate,
  });

  function confirmDeleteBatch(batch: AdminBootcampBatch) {
    if (confirm(`Hapus batch "${batch.title}" beserta semua sesinya?`)) removeBatch(batch._id);
  }

  // ── Session mutations ────────────────────────────────────────────────────────

  const { mutate: addSession, isPending: addingSession } = useMutation({
    mutationFn: (batchId: string) => adminCreateSession(batchId, {
      ...(newSession.value[batchId] ?? emptySession()),
    }),
    onSuccess: (_d, batchId) => {
      invalidate();
      newSession.value[batchId] = emptySession();
    },
  });

  const { mutate: saveSession, isPending: savingSession } = useMutation({
    mutationFn: () => adminUpdateSession(editingSession.value!._id, {
      title: editingSession.value!.title,
      session_name: editingSession.value!.session_name,
      session_date: editingSession.value!.session_date,
      session_start_time: editingSession.value!.session_start_time,
      session_end_time: editingSession.value!.session_end_time,
    }),
    onSuccess: () => { invalidate(); editingSession.value = null; },
  });

  const { mutate: removeSession } = useMutation({
    mutationFn: (id: string) => adminDeleteSession(id),
    onSuccess: invalidate,
  });

  function confirmDeleteSession(session: AdminBootcampSession) {
    if (confirm(`Hapus sesi "${session.session_name}"?`)) removeSession(session._id);
  }

  return {
    pkg, isLoading,
    expandedBatches, toggleBatch, expandAll, collapseAll,
    newBatch, showAddBatch, editingBatch,
    addBatch, addingBatch, saveBatch, savingBatch, confirmDeleteBatch,
    newSession, editingSession,
    addSession, addingSession, saveSession, savingSession, confirmDeleteSession,
  };
}
