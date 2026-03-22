import { Task, TaskStatus } from 'personal-task-tracker-core';

let nextId = 1;

export function createMockTask(overrides: Partial<Task> = {}): Task {
  const id = overrides.id ?? nextId++;
  return {
    id,
    title: `Task ${id}`,
    description: null,
    status: TaskStatus.TODO,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
    ...overrides,
  };
}

export function resetMockId(): void {
  nextId = 1;
}
