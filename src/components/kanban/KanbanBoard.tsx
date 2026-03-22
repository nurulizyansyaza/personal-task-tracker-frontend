'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { Task, TaskStatus, CreateTaskDTO, UpdateTaskDTO } from 'personal-task-tracker-core';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import TaskModal from './TaskModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import toast from 'react-hot-toast';

const COLUMNS: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

export default function KanbanBoard() {
  const { data: tasks, isLoading, isError, error } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: [],
    };
    tasks?.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });
    return grouped;
  }, [tasks]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined;
    if (task) setActiveTask(task);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const task = active.data.current?.task as Task | undefined;
    if (!task) return;

    const targetStatus = over.id as TaskStatus;
    if (!COLUMNS.includes(targetStatus) || task.status === targetStatus) return;

    const statusLabels: Record<TaskStatus, string> = {
      [TaskStatus.TODO]: 'To Do',
      [TaskStatus.IN_PROGRESS]: 'In Progress',
      [TaskStatus.DONE]: 'Done',
    };

    updateTask.mutate(
      { id: task.id, dto: { status: targetStatus } },
      {
        onSuccess: () => {
          toast.success(`Moved to ${statusLabels[targetStatus]}`);
        },
        onError: () => {
          toast.error('Could not move task. Please try again.');
        },
      },
    );
  }, [updateTask]);

  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
  }, []);

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

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Unable to load tasks</h3>
        <p className="text-sm text-gray-500 max-w-sm">
          {(error as Error)?.message || 'Something went wrong. Please check your connection and try again.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              isLoading={isLoading}
              onEdit={openEditModal}
              onDelete={setDeletingTask}
              onAdd={status === TaskStatus.TODO ? openCreateModal : undefined}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="w-[280px]">
              <KanbanCard
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
                isDragging
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={modalOpen}
        mode={modalMode}
        task={editingTask}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        isLoading={createTask.isPending || updateTask.isPending}
      />

      <DeleteConfirmModal
        isOpen={!!deletingTask}
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteTask.isPending}
      />
    </>
  );
}
