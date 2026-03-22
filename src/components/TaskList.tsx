'use client';

import { useState } from 'react';
import { Task, TaskStatus, CreateTaskDTO, UpdateTaskDTO } from 'personal-task-tracker-core';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import StatusFilter from './StatusFilter';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

export default function TaskList() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | undefined>(undefined);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: tasks, isLoading, isError, error } = useTasks(statusFilter);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleCreate = (data: CreateTaskDTO | UpdateTaskDTO) => {
    createTask.mutate(data as CreateTaskDTO);
  };

  const handleUpdate = (data: CreateTaskDTO | UpdateTaskDTO) => {
    if (editingTask) {
      updateTask.mutate(
        { id: editingTask.id, dto: data as UpdateTaskDTO },
        { onSuccess: () => setEditingTask(null) },
      );
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask.mutate(id);
    }
  };

  const handleToggleComplete = (id: number, dto: UpdateTaskDTO) => {
    updateTask.mutate({ id, dto });
  };

  return (
    <div className="space-y-6">
      {/* Create Form */}
      {!editingTask && (
        <TaskForm
          mode="create"
          onSubmit={handleCreate}
          isLoading={createTask.isPending}
        />
      )}

      {/* Edit Form */}
      {editingTask && (
        <TaskForm
          mode="edit"
          initialValues={{
            title: editingTask.title,
            description: editingTask.description || '',
            status: editingTask.status,
          }}
          onSubmit={handleUpdate}
          onCancel={() => setEditingTask(null)}
          isLoading={updateTask.isPending}
        />
      )}

      {/* Filter */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <StatusFilter current={statusFilter} onChange={setStatusFilter} />
        {tasks && (
          <span className="text-sm text-gray-500">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Task List */}
      {isLoading && (
        <div className="text-center py-12 text-gray-500">Loading tasks...</div>
      )}

      {isError && (
        <div className="text-center py-12 text-red-500">
          Failed to load tasks: {(error as Error).message}
        </div>
      )}

      {tasks && tasks.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No tasks found</p>
          <p className="text-sm mt-1">Create your first task above!</p>
        </div>
      )}

      <div className="space-y-3">
        {tasks?.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={setEditingTask}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
        ))}
      </div>
    </div>
  );
}
