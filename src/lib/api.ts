import axios from 'axios';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskStatus } from 'personal-task-tracker-core';
import { localTaskStore } from './local-storage';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const taskApi = {
  getAll: async (status?: TaskStatus): Promise<Task[]> => {
    try {
      const params = status ? { status } : {};
      const { data } = await api.get<ApiResponse<Task[]>>('/tasks', { params });
      localTaskStore.syncFromApi(data.data);
      return data.data;
    } catch {
      return localTaskStore.getAll();
    }
  },

  getById: async (id: number): Promise<Task> => {
    const { data } = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return data.data;
  },

  create: async (dto: CreateTaskDTO): Promise<Task> => {
    try {
      const { data } = await api.post<ApiResponse<Task>>('/tasks', dto);
      return data.data;
    } catch {
      return localTaskStore.create(dto);
    }
  },

  update: async (id: number, dto: UpdateTaskDTO): Promise<Task> => {
    try {
      const { data } = await api.put<ApiResponse<Task>>(`/tasks/${id}`, dto);
      return data.data;
    } catch {
      const updated = localTaskStore.update(id, dto);
      if (!updated) throw new Error('Task not found in local cache');
      return updated;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch {
      localTaskStore.delete(id);
    }
  },
};
