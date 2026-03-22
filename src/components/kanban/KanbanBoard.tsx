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
import { Task, TaskStatus } from 'personal-task-tracker-core';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { useTaskModal } from '@/hooks/useTaskModal';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { useTaskSort, SORT_OPTIONS } from '@/hooks/useTaskSort';
import { COLUMNS, STATUS_LABELS } from '@/lib/status-config';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import TaskModal from './TaskModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import toast from 'react-hot-toast';

export default function KanbanBoard() {
  const { data: tasks, isLoading, isError, error } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { sortedTasks, currentSort, sortIndex, setSortOption } = useTaskSort(tasks);

  const {
    modalOpen, modalMode, editingTask,
    openCreateModal, openEditModal, closeModal, handleModalSubmit,
  } = useTaskModal({ createTask, updateTask });

  const {
    deletingTask,
    openDeleteConfirm, closeDeleteConfirm, handleDeleteConfirm,
  } = useDeleteConfirmation({ deleteTask });

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
    sortedTasks?.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });
    return grouped;
  }, [sortedTasks]);

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

    // over.id may be a column status (string) or a card task ID (number).
    // Resolve to the target column status in both cases.
    let targetStatus: TaskStatus | undefined;
    if (COLUMNS.includes(over.id as TaskStatus)) {
      targetStatus = over.id as TaskStatus;
    } else {
      // Dropped on a card — find which column that card belongs to
      const overTask = over.data.current?.task as Task | undefined;
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    if (!targetStatus || task.status === targetStatus) return;

    updateTask.mutate(
      { id: task.id, dto: { status: targetStatus } },
      {
        onSuccess: () => {
          toast.success(`Moved to ${STATUS_LABELS[targetStatus]}`);
        },
        onError: () => {
          toast.error('Could not move task. Please try again.');
        },
      },
    );
  }, [updateTask]);

  const handleToggleDone = useCallback((task: Task) => {
    const newStatus = task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
    updateTask.mutate(
      { id: task.id, dto: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success(newStatus === TaskStatus.DONE ? 'Task completed!' : 'Task reopened');
        },
        onError: () => {
          toast.error('Could not update task. Please try again.');
        },
      },
    );
  }, [updateTask]);

  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
  }, []);

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
      {/* Sort control */}
      <div className="flex items-center justify-end mb-3">
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs text-gray-500">Sort:</label>
          <select
            id="sort-select"
            value={sortIndex}
            onChange={(e) => setSortOption(Number(e.target.value))}
            className="text-xs bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            {SORT_OPTIONS.map((opt, idx) => (
              <option key={idx} value={idx}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

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
              onDelete={openDeleteConfirm}
              onToggleDone={handleToggleDone}
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
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        isLoading={createTask.isPending || updateTask.isPending}
      />

      <DeleteConfirmModal
        isOpen={!!deletingTask}
        task={deletingTask}
        onClose={closeDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteTask.isPending}
      />
    </>
  );
}
