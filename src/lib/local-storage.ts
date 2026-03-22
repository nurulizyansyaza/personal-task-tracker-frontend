import { Task, TaskStatus, CreateTaskDTO, UpdateTaskDTO } from 'personal-task-tracker-core';

const STORAGE_KEY = 'ptt_tasks_cache';

function readCache(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCache(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage full or unavailable — silently skip
  }
}

function nextLocalId(tasks: Task[]): number {
  if (tasks.length === 0) return -1;
  const minId = Math.min(...tasks.map((t) => t.id));
  return minId > 0 ? -1 : minId - 1;
}

export const localTaskStore = {
  getAll(): Task[] {
    return readCache();
  },

  create(dto: CreateTaskDTO): Task {
    const tasks = readCache();
    const newTask: Task = {
      id: nextLocalId(tasks),
      title: dto.title,
      description: dto.description ?? null,
      status: TaskStatus.TODO,
      created_at: new Date(),
    };
    tasks.unshift(newTask);
    writeCache(tasks);
    return newTask;
  },

  update(id: number, dto: UpdateTaskDTO): Task | null {
    const tasks = readCache();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...dto };
    writeCache(tasks);
    return tasks[idx];
  },

  delete(id: number): boolean {
    const tasks = readCache();
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) return false;
    writeCache(filtered);
    return true;
  },

  syncFromApi(tasks: Task[]): void {
    writeCache(tasks);
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
