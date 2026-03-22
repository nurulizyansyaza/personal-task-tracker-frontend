'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from 'personal-task-tracker-core';
import { COLUMN_CONFIG } from '@/lib/status-config';
import KanbanCard from './KanbanCard';
import KanbanSkeleton from './KanbanSkeleton';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  isLoading?: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleDone?: (task: Task) => void;
  onAdd?: () => void;
}

export default function KanbanColumn({
  status,
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onToggleDone,
  onAdd,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = COLUMN_CONFIG[status];
  const taskIds = tasks.map((t) => t.id);

  return (
    <div className={`flex flex-col rounded-xl ${config.bgColor} border border-gray-200/60 min-h-[400px]`}>
      {/* Column header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl ${config.headerColor}`}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{config.title}</h3>
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${config.countColor}`}>
            {tasks.length}
          </span>
        </div>
        {status === TaskStatus.TODO && onAdd && (
          <button
            onClick={onAdd}
            className="p-1 rounded-md hover:bg-white/60 transition-colors"
            title="Add new task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-2 space-y-2 transition-colors duration-150 rounded-b-xl min-h-[100px]
          ${isOver ? 'bg-blue-50/60 ring-2 ring-blue-300 ring-inset' : ''}`}
      >
        {isLoading ? (
          <KanbanSkeleton count={status === TaskStatus.TODO ? 3 : 2} />
        ) : (
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <KanbanCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onToggleDone={onToggleDone} />
            ))}
          </SortableContext>
        )}

        {!isLoading && tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 text-xs text-gray-400">
            {status === TaskStatus.TODO
              ? 'No tasks yet — add one!'
              : 'Drag tasks here'}
          </div>
        )}
      </div>
    </div>
  );
}
