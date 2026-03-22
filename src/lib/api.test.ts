import { taskApi } from './api';
import axios from 'axios';
import { TaskStatus } from 'personal-task-tracker-core';

jest.mock('axios', () => {
  const mockAxios: Record<string, unknown> = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  mockAxios.create = jest.fn(() => mockAxios);
  return { __esModule: true, default: mockAxios };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockInstance = mockedAxios.create() as jest.Mocked<typeof axios>;

describe('taskApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all tasks without filter', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', status: TaskStatus.TODO },
      ];
      mockInstance.get.mockResolvedValue({ data: { success: true, data: mockTasks } });

      const result = await taskApi.getAll();
      expect(result).toEqual(mockTasks);
      expect(mockInstance.get).toHaveBeenCalledWith('/tasks', { params: {} });
    });

    it('should fetch tasks with status filter', async () => {
      const mockTasks = [
        { id: 2, title: 'Task 2', status: TaskStatus.DONE },
      ];
      mockInstance.get.mockResolvedValue({ data: { success: true, data: mockTasks } });

      const result = await taskApi.getAll(TaskStatus.DONE);
      expect(result).toEqual(mockTasks);
      expect(mockInstance.get).toHaveBeenCalledWith('/tasks', { params: { status: TaskStatus.DONE } });
    });

    it('should fall back to localStorage on network error', async () => {
      mockInstance.get.mockRejectedValue(new Error('Network Error'));
      const result = await taskApi.getAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getById', () => {
    it('should fetch a task by id', async () => {
      const mockTask = { id: 1, title: 'Task 1', status: TaskStatus.TODO };
      mockInstance.get.mockResolvedValue({ data: { success: true, data: mockTask } });

      const result = await taskApi.getById(1);
      expect(result).toEqual(mockTask);
      expect(mockInstance.get).toHaveBeenCalledWith('/tasks/1');
    });
  });

  describe('create', () => {
    it('should create a task', async () => {
      const newTask = { title: 'New Task' };
      const createdTask = { id: 1, title: 'New Task', status: TaskStatus.TODO };
      mockInstance.post.mockResolvedValue({ data: { success: true, data: createdTask } });

      const result = await taskApi.create(newTask);
      expect(result).toEqual(createdTask);
      expect(mockInstance.post).toHaveBeenCalledWith('/tasks', newTask);
    });

    it('should create a task with description', async () => {
      const newTask = { title: 'New Task', description: 'Details' };
      const createdTask = { id: 2, ...newTask, status: TaskStatus.TODO };
      mockInstance.post.mockResolvedValue({ data: { success: true, data: createdTask } });

      const result = await taskApi.create(newTask);
      expect(result).toEqual(createdTask);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateDto = { title: 'Updated' };
      const updatedTask = { id: 1, title: 'Updated', status: TaskStatus.TODO };
      mockInstance.put.mockResolvedValue({ data: { success: true, data: updatedTask } });

      const result = await taskApi.update(1, updateDto);
      expect(result).toEqual(updatedTask);
      expect(mockInstance.put).toHaveBeenCalledWith('/tasks/1', updateDto);
    });

    it('should update task status', async () => {
      const updateDto = { status: TaskStatus.DONE };
      const updatedTask = { id: 1, title: 'Task', status: TaskStatus.DONE };
      mockInstance.put.mockResolvedValue({ data: { success: true, data: updatedTask } });

      const result = await taskApi.update(1, updateDto);
      expect(result).toEqual(updatedTask);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      mockInstance.delete.mockResolvedValue({ data: { success: true } });

      await taskApi.delete(1);
      expect(mockInstance.delete).toHaveBeenCalledWith('/tasks/1');
    });

    it('should fall back to localStorage on delete error', async () => {
      mockInstance.delete.mockRejectedValue(new Error('Network Error'));
      await expect(taskApi.delete(1)).resolves.toBeUndefined();
    });
  });

  describe('offline fallback', () => {
    it('should create task locally when API fails', async () => {
      mockInstance.post.mockRejectedValue(new Error('Network Error'));
      const result = await taskApi.create({ title: 'Offline Task' });
      expect(result.title).toBe('Offline Task');
      expect(result.id).toBeLessThan(0);
    });

    it('should sync tasks to localStorage on successful getAll', async () => {
      const mockTasks = [{ id: 1, title: 'Task 1', status: TaskStatus.TODO }];
      mockInstance.get.mockResolvedValue({ data: { success: true, data: mockTasks } });
      await taskApi.getAll();
      // Subsequent offline call should return cached data
      mockInstance.get.mockRejectedValue(new Error('Network Error'));
      const cached = await taskApi.getAll();
      expect(cached).toEqual(mockTasks);
    });
  });
});
