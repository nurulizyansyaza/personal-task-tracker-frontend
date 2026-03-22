import { renderHook, act } from '@testing-library/react';
import { useDeleteConfirmation } from './useDeleteConfirmation';
import { createMockTask } from '@/test/mocks';

jest.mock('react-hot-toast', () => ({
  default: { success: jest.fn(), error: jest.fn() },
  __esModule: true,
}));

describe('useDeleteConfirmation', () => {
  const mockDeleteMutate = jest.fn();
  const deleteTask = { mutate: mockDeleteMutate };

  beforeEach(() => jest.clearAllMocks());

  it('should initialize with no deleting task', () => {
    const { result } = renderHook(() => useDeleteConfirmation({ deleteTask }));
    expect(result.current.deletingTask).toBeNull();
  });

  it('should set deleting task on openDeleteConfirm', () => {
    const task = createMockTask({ id: 3, title: 'Delete me' });
    const { result } = renderHook(() => useDeleteConfirmation({ deleteTask }));
    act(() => result.current.openDeleteConfirm(task));
    expect(result.current.deletingTask).toEqual(task);
  });

  it('should clear deleting task on closeDeleteConfirm', () => {
    const task = createMockTask({ id: 3 });
    const { result } = renderHook(() => useDeleteConfirmation({ deleteTask }));
    act(() => result.current.openDeleteConfirm(task));
    act(() => result.current.closeDeleteConfirm());
    expect(result.current.deletingTask).toBeNull();
  });

  it('should call deleteTask.mutate on handleDeleteConfirm', () => {
    const task = createMockTask({ id: 7 });
    const { result } = renderHook(() => useDeleteConfirmation({ deleteTask }));
    act(() => result.current.openDeleteConfirm(task));
    act(() => result.current.handleDeleteConfirm());
    expect(mockDeleteMutate).toHaveBeenCalledWith(
      7,
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    );
  });

  it('should not call deleteTask.mutate if no deleting task', () => {
    const { result } = renderHook(() => useDeleteConfirmation({ deleteTask }));
    act(() => result.current.handleDeleteConfirm());
    expect(mockDeleteMutate).not.toHaveBeenCalled();
  });
});
