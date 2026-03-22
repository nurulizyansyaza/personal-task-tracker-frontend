'use client';

import { Task, TaskStatus, UpdateTaskDTO } from 'personal-task-tracker-core';

const statusBadge: Record<TaskStatus, { label: string; className: string }> = {
  [TaskStatus.TODO]: {
    label: 'To Do',
    className: 'bg-gray-100 text-gray-700',
  },
  [TaskStatus.IN_PROGRESS]: {
    label: 'In Progress',
    className: 'bg-yellow-100 text-yellow-800',
  },
  [TaskStatus.DONE]: {
    label: 'Done',
    className: 'bg-green-100 text-green-800',
  },
};

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number, dto: UpdateTaskDTO) => void;
}

export default function TaskItem({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskItemProps) {
  const badge = statusBadge[task.status];
  const isDone = task.status === TaskStatus.DONE;

  const handleToggle = () => {
    onToggleComplete(task.id, {
      status: isDone ? TaskStatus.TODO : TaskStatus.DONE,
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={handleToggle}
            title={isDone ? 'Mark as To Do' : 'Mark as Done'}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
              isDone
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-400'
            }`}
          >
            {isDone && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium text-gray-900 ${isDone ? 'line-through text-gray-400' : ''}`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-500 mt-1 break-words">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(task.created_at).toLocaleDateString('en-MY', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
