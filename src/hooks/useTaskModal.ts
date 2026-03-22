import { useState, useCallback } from 'react';
import { Task, CreateTaskDTO, UpdateTaskDTO } from 'personal-task-tracker-core';
import toast from 'react-hot-toast';

interface UseTaskModalOptions {
  createTask: { mutate: (dto: CreateTaskDTO, opts: { onSuccess: () => void; onError: () => void }) => void };
  updateTask: { mutate: (args: { id: number; dto: UpdateTaskDTO }, opts: { onSuccess: () => void; onError: () => void }) => void };
}

export function useTaskModal({ createTask, updateTask }: UseTaskModalOptions) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const openCreateModal = useCallback(() => {
    setModalMode('create');
    setEditingTask(null);
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback((task: Task) => {
    setModalMode('edit');
    setEditingTask(task);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleModalSubmit = useCallback((data: CreateTaskDTO | UpdateTaskDTO) => {
    if (modalMode === 'create') {
      createTask.mutate(data as CreateTaskDTO, {
        onSuccess: () => {
          toast.success('Task created!');
          setModalOpen(false);
        },
        onError: () => {
          toast.error('Could not create task. Please try again.');
        },
      });
    } else if (editingTask) {
      updateTask.mutate(
        { id: editingTask.id, dto: data as UpdateTaskDTO },
        {
          onSuccess: () => {
            toast.success('Task updated!');
            setModalOpen(false);
          },
          onError: () => {
            toast.error('Could not update task. Please try again.');
          },
        },
      );
    }
  }, [modalMode, editingTask, createTask, updateTask]);

  return {
    modalOpen,
    modalMode,
    editingTask,
    openCreateModal,
    openEditModal,
    closeModal,
    handleModalSubmit,
  };
}
