'use client';

import { useState } from 'react';
import { CreateTaskDTO, UpdateTaskDTO, TaskStatus } from 'personal-task-tracker-core';

interface TaskFormProps {
  mode: 'create' | 'edit';
  initialValues?: { title: string; description: string; status: TaskStatus };
  onSubmit: (data: CreateTaskDTO | UpdateTaskDTO) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function TaskForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [status, setStatus] = useState<TaskStatus>(initialValues?.status || TaskStatus.TODO);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');

    if (mode === 'create') {
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
      } as CreateTaskDTO);
    } else {
      onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        status,
      } as UpdateTaskDTO);
    }

    if (mode === 'create') {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800">
        {mode === 'create' ? 'Add New Task' : 'Edit Task'}
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
          maxLength={255}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
          maxLength={1000}
        />
      </div>

      {mode === 'edit' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
          >
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.DONE}>Done</option>
          </select>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
        >
          {isLoading ? 'Saving...' : mode === 'create' ? 'Add Task' : 'Save Changes'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
