'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, TaskStatus, CreateTaskDTO, UpdateTaskDTO } from 'personal-task-tracker-core';
import { STATUS_LABELS } from '@/lib/status-config';

interface TaskModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  task?: Task | null;
  onClose: () => void;
  onSubmit: (data: CreateTaskDTO | UpdateTaskDTO) => void;
  isLoading?: boolean;
}

function TaskModalInner({
  mode,
  task,
  onClose,
  onSubmit,
  isLoading,
}: Omit<TaskModalProps, 'isOpen'>) {
  const [title, setTitle] = useState(mode === 'edit' && task ? task.title : '');
  const [description, setDescription] = useState(mode === 'edit' && task ? task.description || '' : '');
  const [status, setStatus] = useState<TaskStatus>(mode === 'edit' && task ? task.status : TaskStatus.TODO);
  const [error, setError] = useState('');

  const handleClose = useCallback(() => {
    if (!isLoading) onClose();
  }, [isLoading, onClose]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [handleClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Title is required');
      return;
    }
    if (trimmedTitle.length > 255) {
      setError('Title must be 255 characters or less');
      return;
    }
    setError('');

    if (mode === 'create') {
      onSubmit({
        title: trimmedTitle,
        description: description.trim() || undefined,
      } as CreateTaskDTO);
    } else {
      onSubmit({
        title: trimmedTitle,
        description: description.trim() || null,
        status,
      } as UpdateTaskDTO);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === 'create' ? 'New Task' : 'Edit Task'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              placeholder="What needs to be done?"
              className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-all text-gray-900 placeholder:text-gray-400
                ${error ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'}`}
              maxLength={255}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details (optional)"
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none text-gray-900 placeholder:text-gray-400"
              maxLength={1000}
            />
            <p className="text-xs text-gray-400 text-right mt-0.5">
              {description.length}/1000
            </p>
          </div>

          {mode === 'edit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900"
              >
                <option value={TaskStatus.TODO}>{STATUS_LABELS[TaskStatus.TODO]}</option>
                <option value={TaskStatus.IN_PROGRESS}>{STATUS_LABELS[TaskStatus.IN_PROGRESS]}</option>
                <option value={TaskStatus.DONE}>{STATUS_LABELS[TaskStatus.DONE]}</option>
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : mode === 'create' ? 'Create Task' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TaskModal({ isOpen, ...props }: TaskModalProps) {
  // Use a key to force remount when modal opens, avoiding setState-in-effect
  const modalKey = useMemo(
    () => `${props.mode}-${props.task?.id ?? 'new'}-${Date.now()}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOpen, props.mode, props.task?.id],
  );

  if (!isOpen) return null;
  return <TaskModalInner key={modalKey} {...props} />;
}
