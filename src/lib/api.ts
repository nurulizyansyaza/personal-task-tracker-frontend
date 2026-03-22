import axios from 'axios';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskStatus } from 'personal-task-tracker-core';

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
    const params = status ? { status } : {};
    const { data } = await api.get<ApiResponse<Task[]>>('/tasks', { params });
    return data.data;
  },

  getById: async (id: number): Promise<Task> => {
    const { data } = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return data.data;
  },

  create: async (dto: CreateTaskDTO): Promise<Task> => {
    const { data } = await api.post<ApiResponse<Task>>('/tasks', dto);
    return data.data;
  },

  update: async (id: number, dto: UpdateTaskDTO): Promise<Task> => {
    const { data } = await api.put<ApiResponse<Task>>(`/tasks/${id}`, dto);
    return data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
