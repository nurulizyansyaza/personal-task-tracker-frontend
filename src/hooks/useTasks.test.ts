import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskStatus } from 'personal-task-tracker-core';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from './useTasks';
import { taskApi } from '@/lib/api';
import React from 'react';

jest.mock('@/lib/api', () => ({
  taskApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = taskApi as jest.Mocked<typeof taskApi>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
}

describe('useTasks', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should fetch all tasks', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', description: null, status: TaskStatus.TODO, created_at: new Date() },
    ];
    mockedApi.getAll.mockResolvedValue(mockTasks);

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockTasks);
    expect(mockedApi.getAll).toHaveBeenCalledWith(undefined);
  });

  it('should fetch tasks with status filter', async () => {
    const mockTasks = [
      { id: 2, title: 'Done Task', description: null, status: TaskStatus.DONE, created_at: new Date() },
    ];
    mockedApi.getAll.mockResolvedValue(mockTasks);

    const { result } = renderHook(() => useTasks(TaskStatus.DONE), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.getAll).toHaveBeenCalledWith(TaskStatus.DONE);
  });

  it('should handle fetch error', async () => {
    mockedApi.getAll.mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe('useCreateTask', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should create a task', async () => {
    const newTask = { id: 1, title: 'New', description: null, status: TaskStatus.TODO, created_at: new Date() };
    mockedApi.create.mockResolvedValue(newTask);

    const { result } = renderHook(() => useCreateTask(), { wrapper: createWrapper() });

    result.current.mutate({ title: 'New' });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.create).toHaveBeenCalledWith({ title: 'New' });
  });
});

describe('useUpdateTask', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should update a task', async () => {
    const updated = { id: 1, title: 'Updated', description: null, status: TaskStatus.DONE, created_at: new Date() };
    mockedApi.update.mockResolvedValue(updated);

    const { result } = renderHook(() => useUpdateTask(), { wrapper: createWrapper() });

    result.current.mutate({ id: 1, dto: { status: TaskStatus.DONE } });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.update).toHaveBeenCalledWith(1, { status: TaskStatus.DONE });
  });
});

describe('useDeleteTask', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should delete a task', async () => {
    mockedApi.delete.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteTask(), { wrapper: createWrapper() });

    result.current.mutate(1);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.delete).toHaveBeenCalledWith(1);
  });
});
