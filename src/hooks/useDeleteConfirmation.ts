import { useState, useCallback } from 'react';
import { Task } from 'personal-task-tracker-core';
import toast from 'react-hot-toast';

interface UseDeleteConfirmationOptions {
  deleteTask: { mutate: (id: number, opts: { onSuccess: () => void; onError: () => void }) => void };
}

export function useDeleteConfirmation({ deleteTask }: UseDeleteConfirmationOptions) {
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const openDeleteConfirm = useCallback((task: Task) => {
    setDeletingTask(task);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setDeletingTask(null);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deletingTask) return;
    deleteTask.mutate(deletingTask.id, {
      onSuccess: () => {
        toast.success('Task deleted');
        setDeletingTask(null);
      },
      onError: () => {
        toast.error('Could not delete task. Please try again.');
      },
    });
  }, [deletingTask, deleteTask]);

  return {
    deletingTask,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleDeleteConfirm,
  };
}
