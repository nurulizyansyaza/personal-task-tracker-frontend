import { localTaskStore } from './local-storage';
import { TaskStatus } from 'personal-task-tracker-core';

// Mock localStorage
const store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: jest.fn((key: string) => store[key] ?? null),
  setItem: jest.fn((key: string, val: string) => { store[key] = val; }),
  removeItem: jest.fn((key: string) => { delete store[key]; }),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('localTaskStore', () => {
  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return empty array when cache is empty', () => {
      expect(localTaskStore.getAll()).toEqual([]);
    });

    it('should return cached tasks', () => {
      const tasks = [{ id: 1, title: 'Task 1', description: null, status: TaskStatus.TODO, created_at: new Date().toISOString() }];
      store['ptt_tasks_cache'] = JSON.stringify(tasks);
      expect(localTaskStore.getAll()).toEqual(tasks);
    });

    it('should return empty array on malformed JSON', () => {
      store['ptt_tasks_cache'] = 'not-json';
      expect(localTaskStore.getAll()).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a task with negative ID', () => {
      const task = localTaskStore.create({ title: 'New Task' });
      expect(task.id).toBe(-1);
      expect(task.title).toBe('New Task');
      expect(task.status).toBe(TaskStatus.TODO);
    });

    it('should assign sequential negative IDs', () => {
      localTaskStore.create({ title: 'First' });
      const second = localTaskStore.create({ title: 'Second' });
      expect(second.id).toBe(-2);
    });

    it('should persist to localStorage', () => {
      localTaskStore.create({ title: 'Persisted' });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'ptt_tasks_cache',
        expect.stringContaining('Persisted'),
      );
    });
  });

  describe('update', () => {
    it('should update an existing task', () => {
      localTaskStore.create({ title: 'Original' });
      const tasks = localTaskStore.getAll();
      const updated = localTaskStore.update(tasks[0].id, { title: 'Updated' });
      expect(updated?.title).toBe('Updated');
    });

    it('should return null for non-existent task', () => {
      expect(localTaskStore.update(999, { title: 'Missing' })).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete an existing task', () => {
      localTaskStore.create({ title: 'To Delete' });
      const tasks = localTaskStore.getAll();
      expect(localTaskStore.delete(tasks[0].id)).toBe(true);
      expect(localTaskStore.getAll()).toHaveLength(0);
    });

    it('should return false for non-existent task', () => {
      expect(localTaskStore.delete(999)).toBe(false);
    });
  });

  describe('syncFromApi', () => {
    it('should overwrite cache with API data', () => {
      localTaskStore.create({ title: 'Local' });
      const apiTasks = [{ id: 10, title: 'API Task', description: null, status: TaskStatus.DONE, created_at: new Date() }];
      localTaskStore.syncFromApi(apiTasks);
      const cached = localTaskStore.getAll();
      expect(cached).toHaveLength(1);
      expect(cached[0].title).toBe('API Task');
    });
  });

  describe('clear', () => {
    it('should remove cache from localStorage', () => {
      localTaskStore.create({ title: 'Will be cleared' });
      localTaskStore.clear();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('ptt_tasks_cache');
    });
  });
});
