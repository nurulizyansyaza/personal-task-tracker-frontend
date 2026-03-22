'use client';

import { TaskStatus } from 'personal-task-tracker-core';

const statusOptions: { label: string; value: TaskStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'To Do', value: TaskStatus.TODO },
  { label: 'In Progress', value: TaskStatus.IN_PROGRESS },
  { label: 'Done', value: TaskStatus.DONE },
];

interface StatusFilterProps {
  current: TaskStatus | undefined;
  onChange: (status: TaskStatus | undefined) => void;
}

export default function StatusFilter({ current, onChange }: StatusFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {statusOptions.map((opt) => {
        const isActive =
          opt.value === 'ALL' ? current === undefined : current === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value === 'ALL' ? undefined : (opt.value as TaskStatus))}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
