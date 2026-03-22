import { TaskStatus } from 'personal-task-tracker-core';

export const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.DONE]: 'Done',
};

export const STATUS_BORDER_COLOR: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'border-l-gray-400',
  [TaskStatus.IN_PROGRESS]: 'border-l-amber-400',
  [TaskStatus.DONE]: 'border-l-emerald-400',
};

export interface ColumnStyle {
  title: string;
  headerColor: string;
  bgColor: string;
  countColor: string;
}

export const COLUMN_CONFIG: Record<TaskStatus, ColumnStyle> = {
  [TaskStatus.TODO]: {
    title: STATUS_LABELS[TaskStatus.TODO],
    headerColor: 'bg-gray-100 text-gray-700',
    bgColor: 'bg-gray-50/50',
    countColor: 'bg-gray-200 text-gray-600',
  },
  [TaskStatus.IN_PROGRESS]: {
    title: STATUS_LABELS[TaskStatus.IN_PROGRESS],
    headerColor: 'bg-amber-50 text-amber-700',
    bgColor: 'bg-amber-50/30',
    countColor: 'bg-amber-100 text-amber-600',
  },
  [TaskStatus.DONE]: {
    title: STATUS_LABELS[TaskStatus.DONE],
    headerColor: 'bg-emerald-50 text-emerald-700',
    bgColor: 'bg-emerald-50/30',
    countColor: 'bg-emerald-100 text-emerald-600',
  },
};

export const COLUMNS: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.DONE,
];
