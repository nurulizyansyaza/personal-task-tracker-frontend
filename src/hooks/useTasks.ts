'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TaskStatus, CreateTaskDTO, UpdateTaskDTO } from 'personal-task-tracker-core';
import { taskApi } from '@/lib/api';

export function useTasks(statusFilter?: TaskStatus) {
  return useQuery({
    queryKey: ['tasks', statusFilter],
    queryFn: () => taskApi.getAll(statusFilter),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateTaskDTO) => taskApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateTaskDTO }) =>
      taskApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => taskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
