import { useState, useMemo, useCallback } from 'react';
import { Task, TaskStatus } from 'personal-task-tracker-core';

export type SortField = 'created_at' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  field: SortField;
  direction: SortDirection;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { field: 'created_at', direction: 'desc', label: 'Newest first' },
  { field: 'created_at', direction: 'asc', label: 'Oldest first' },
  { field: 'status', direction: 'asc', label: 'Status: To Do first' },
  { field: 'status', direction: 'desc', label: 'Status: Done first' },
];

const STATUS_ORDER: Record<TaskStatus, number> = {
  [TaskStatus.TODO]: 0,
  [TaskStatus.IN_PROGRESS]: 1,
  [TaskStatus.DONE]: 2,
};

function compareTasks(a: Task, b: Task, field: SortField, direction: SortDirection): number {
  let result: number;
  if (field === 'status') {
    result = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
  } else {
    result = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  }
  return direction === 'asc' ? result : -result;
}

export function useTaskSort(tasks: Task[] | undefined) {
  const [sortIndex, setSortIndex] = useState(0);

  const currentSort = SORT_OPTIONS[sortIndex];

  const sortedTasks = useMemo(() => {
    if (!tasks) return undefined;
    return [...tasks].sort((a, b) =>
      compareTasks(a, b, currentSort.field, currentSort.direction),
    );
  }, [tasks, currentSort]);

  const cycleSortOption = useCallback(() => {
    setSortIndex((prev) => (prev + 1) % SORT_OPTIONS.length);
  }, []);

  const setSortOption = useCallback((index: number) => {
    if (index >= 0 && index < SORT_OPTIONS.length) {
      setSortIndex(index);
    }
  }, []);

  return {
    sortedTasks,
    currentSort,
    sortIndex,
    cycleSortOption,
    setSortOption,
  };
}
