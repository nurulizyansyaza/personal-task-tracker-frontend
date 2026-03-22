'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskStatus } from 'personal-task-tracker-core';
import { STATUS_BORDER_COLOR } from '@/lib/status-config';

interface KanbanCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleDone?: (task: Task) => void;
  isDragging?: boolean;
}

export default function KanbanCard({ task, onEdit, onDelete, onToggleDone, isDragging }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragging = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white rounded-lg border-l-4 ${STATUS_BORDER_COLOR[task.status]} shadow-sm 
        hover:shadow-md transition-all duration-150 select-none
        ${dragging ? 'opacity-50 shadow-lg scale-105 rotate-2' : ''}`}
    >
      {/* Drag handle area */}
      <div
        {...attributes}
        {...listeners}
        className="px-3 pt-3 pb-1 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-start justify-between gap-2">
          <h4 className={`text-sm font-medium text-gray-900 leading-snug break-words flex-1
            ${task.status === TaskStatus.DONE ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </h4>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <span className="text-gray-300 text-xs">⠿</span>
          </div>
        </div>
        {task.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 break-words">
            {task.description}
          </p>
        )}
      </div>

      {/* Actions area (not draggable) */}
      <div className="px-3 pb-3 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onToggleDone && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleDone(task); }}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0
                ${task.status === TaskStatus.DONE
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-gray-300 hover:border-emerald-400'}`}
              title={task.status === TaskStatus.DONE ? 'Mark as to do' : 'Mark as done'}
              aria-label={task.status === TaskStatus.DONE ? 'Mark as to do' : 'Mark as done'}
            >
              {task.status === TaskStatus.DONE && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          )}
          <span className="text-[10px] text-gray-400">
            {new Date(task.created_at).toLocaleDateString('en-MY', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit task"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task); }}
            className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete task"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
