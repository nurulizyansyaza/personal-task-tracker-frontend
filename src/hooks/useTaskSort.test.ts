import { renderHook, act } from '@testing-library/react';
import { useTaskSort, SORT_OPTIONS } from './useTaskSort';
import { TaskStatus } from 'personal-task-tracker-core';
import { createMockTask } from '@/test/mocks';

const mockTasks = [
  createMockTask({ id: 1, title: 'A', status: TaskStatus.DONE, created_at: new Date('2025-01-01') }),
  createMockTask({ id: 2, title: 'B', status: TaskStatus.TODO, created_at: new Date('2025-03-01') }),
  createMockTask({ id: 3, title: 'C', status: TaskStatus.IN_PROGRESS, created_at: new Date('2025-02-01') }),
];

describe('useTaskSort', () => {
  it('should default to newest first', () => {
    const { result } = renderHook(() => useTaskSort(mockTasks));
    expect(result.current.currentSort.label).toBe('Newest first');
    expect(result.current.sortedTasks?.[0].id).toBe(2); // Mar > Feb > Jan
  });

  it('should sort oldest first', () => {
    const { result } = renderHook(() => useTaskSort(mockTasks));
    act(() => result.current.setSortOption(1));
    expect(result.current.currentSort.label).toBe('Oldest first');
    expect(result.current.sortedTasks?.[0].id).toBe(1); // Jan first
  });

  it('should sort by status: To Do first', () => {
    const { result } = renderHook(() => useTaskSort(mockTasks));
    act(() => result.current.setSortOption(2));
    expect(result.current.currentSort.label).toBe('Status: To Do first');
    expect(result.current.sortedTasks?.[0].status).toBe(TaskStatus.TODO);
    expect(result.current.sortedTasks?.[2].status).toBe(TaskStatus.DONE);
  });

  it('should sort by status: Done first', () => {
    const { result } = renderHook(() => useTaskSort(mockTasks));
    act(() => result.current.setSortOption(3));
    expect(result.current.currentSort.label).toBe('Status: Done first');
    expect(result.current.sortedTasks?.[0].status).toBe(TaskStatus.DONE);
  });

  it('should return undefined when tasks is undefined', () => {
    const { result } = renderHook(() => useTaskSort(undefined));
    expect(result.current.sortedTasks).toBeUndefined();
  });

  it('should ignore invalid sort index', () => {
    const { result } = renderHook(() => useTaskSort(mockTasks));
    act(() => result.current.setSortOption(99));
    expect(result.current.sortIndex).toBe(0); // unchanged
  });

  it('should cycle through sort options', () => {
    const { result } = renderHook(() => useTaskSort(mockTasks));
    act(() => result.current.cycleSortOption());
    expect(result.current.sortIndex).toBe(1);
    act(() => result.current.cycleSortOption());
    expect(result.current.sortIndex).toBe(2);
  });

  it('should have 4 sort options', () => {
    expect(SORT_OPTIONS).toHaveLength(4);
  });
});
