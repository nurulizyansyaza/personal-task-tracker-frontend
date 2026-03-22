import { renderHook, act } from '@testing-library/react';
import { TaskStatus } from 'personal-task-tracker-core';
import { useTaskModal } from './useTaskModal';
import { createMockTask } from '@/test/mocks';

jest.mock('react-hot-toast', () => ({
  default: { success: jest.fn(), error: jest.fn() },
  __esModule: true,
}));

describe('useTaskModal', () => {
  const mockCreateMutate = jest.fn();
  const mockUpdateMutate = jest.fn();

  const createTask = { mutate: mockCreateMutate };
  const updateTask = { mutate: mockUpdateMutate };

  beforeEach(() => jest.clearAllMocks());

  it('should initialize with modal closed in create mode', () => {
    const { result } = renderHook(() => useTaskModal({ createTask, updateTask }));
    expect(result.current.modalOpen).toBe(false);
    expect(result.current.modalMode).toBe('create');
    expect(result.current.editingTask).toBeNull();
  });

  it('should open create modal', () => {
    const { result } = renderHook(() => useTaskModal({ createTask, updateTask }));
    act(() => result.current.openCreateModal());
    expect(result.current.modalOpen).toBe(true);
    expect(result.current.modalMode).toBe('create');
    expect(result.current.editingTask).toBeNull();
  });

  it('should open edit modal with task', () => {
    const task = createMockTask({ id: 1, title: 'Edit me' });
    const { result } = renderHook(() => useTaskModal({ createTask, updateTask }));
    act(() => result.current.openEditModal(task));
    expect(result.current.modalOpen).toBe(true);
    expect(result.current.modalMode).toBe('edit');
    expect(result.current.editingTask).toEqual(task);
  });

  it('should close modal', () => {
    const { result } = renderHook(() => useTaskModal({ createTask, updateTask }));
    act(() => result.current.openCreateModal());
    act(() => result.current.closeModal());
    expect(result.current.modalOpen).toBe(false);
  });

  it('should call createTask.mutate on submit in create mode', () => {
    const { result } = renderHook(() => useTaskModal({ createTask, updateTask }));
    act(() => result.current.openCreateModal());
    act(() => result.current.handleModalSubmit({ title: 'New', status: TaskStatus.TODO }));
    expect(mockCreateMutate).toHaveBeenCalledWith(
      { title: 'New', status: TaskStatus.TODO },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    );
  });

  it('should call updateTask.mutate on submit in edit mode', () => {
    const task = createMockTask({ id: 5, title: 'Old' });
    const { result } = renderHook(() => useTaskModal({ createTask, updateTask }));
    act(() => result.current.openEditModal(task));
    act(() => result.current.handleModalSubmit({ title: 'Updated' }));
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      { id: 5, dto: { title: 'Updated' } },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    );
  });
});
