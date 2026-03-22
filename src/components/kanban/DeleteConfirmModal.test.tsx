import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DeleteConfirmModal from './DeleteConfirmModal';
import { TaskStatus, Task } from 'personal-task-tracker-core';

const mockTask: Task = {
  id: 1,
  title: 'Task to Delete',
  description: null,
  status: TaskStatus.TODO,
  created_at: '2026-01-15T10:00:00Z',
  updated_at: '2026-01-15T10:00:00Z',
};

describe('DeleteConfirmModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('should not render when isOpen is false', () => {
    render(
      <DeleteConfirmModal isOpen={false} task={mockTask} onClose={mockOnClose} onConfirm={mockOnConfirm} />
    );
    expect(screen.queryByText('Delete Task')).not.toBeInTheDocument();
  });

  it('should not render when task is null', () => {
    render(
      <DeleteConfirmModal isOpen={true} task={null} onClose={mockOnClose} onConfirm={mockOnConfirm} />
    );
    expect(screen.queryByText('Delete Task')).not.toBeInTheDocument();
  });

  it('should render with task title', () => {
    render(
      <DeleteConfirmModal isOpen={true} task={mockTask} onClose={mockOnClose} onConfirm={mockOnConfirm} />
    );
    expect(screen.getByText('Delete Task')).toBeInTheDocument();
    expect(screen.getByText(/Task to Delete/)).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('should call onConfirm when Delete is clicked', async () => {
    render(
      <DeleteConfirmModal isOpen={true} task={mockTask} onClose={mockOnClose} onConfirm={mockOnConfirm} />
    );
    await userEvent.click(screen.getByText('Delete'));
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('should call onClose when Cancel is clicked', async () => {
    render(
      <DeleteConfirmModal isOpen={true} task={mockTask} onClose={mockOnClose} onConfirm={mockOnConfirm} />
    );
    await userEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should show Deleting... when isLoading', () => {
    render(
      <DeleteConfirmModal isOpen={true} task={mockTask} onClose={mockOnClose} onConfirm={mockOnConfirm} isLoading />
    );
    expect(screen.getByText('Deleting...')).toBeInTheDocument();
  });

  it('should call onClose when backdrop is clicked', async () => {
    render(
      <DeleteConfirmModal isOpen={true} task={mockTask} onClose={mockOnClose} onConfirm={mockOnConfirm} />
    );
    const backdrop = document.querySelector('.backdrop-blur-sm');
    if (backdrop) {
      await userEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });
});
