import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TaskModal from './TaskModal';
import { TaskStatus } from 'personal-task-tracker-core';

describe('TaskModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('should not render when isOpen is false', () => {
    render(
      <TaskModal isOpen={false} mode="create" onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    expect(screen.queryByText('✨ New Task')).not.toBeInTheDocument();
  });

  it('should render create mode', () => {
    render(
      <TaskModal isOpen={true} mode="create" onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    expect(screen.getByText('✨ New Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('should render edit mode with task data', () => {
    const task = {
      id: 1,
      title: 'Existing Task',
      description: 'Existing desc',
      status: TaskStatus.IN_PROGRESS,
      created_at: '2026-01-15T10:00:00Z',
      updated_at: '2026-01-15T10:00:00Z',
    };
    render(
      <TaskModal isOpen={true} mode="edit" task={task} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    expect(screen.getByText('✏️ Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing desc')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('should show validation error for empty title', async () => {
    render(
      <TaskModal isOpen={true} mode="create" onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    await userEvent.click(screen.getByText('Create Task'));
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit create form with valid data', async () => {
    render(
      <TaskModal isOpen={true} mode="create" onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    await userEvent.type(screen.getByPlaceholderText('What needs to be done?'), 'New Task');
    await userEvent.click(screen.getByText('Create Task'));
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'New Task',
      description: undefined,
    });
  });

  it('should submit create form with description', async () => {
    render(
      <TaskModal isOpen={true} mode="create" onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    await userEvent.type(screen.getByPlaceholderText('What needs to be done?'), 'Task Title');
    await userEvent.type(screen.getByPlaceholderText('Add more details (optional)'), 'Some details');
    await userEvent.click(screen.getByText('Create Task'));
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Task Title',
      description: 'Some details',
    });
  });

  it('should call onClose when Cancel is clicked', async () => {
    render(
      <TaskModal isOpen={true} mode="create" onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    await userEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when backdrop is clicked', async () => {
    render(
      <TaskModal isOpen={true} mode="create" onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    const backdrop = document.querySelector('.backdrop-blur-sm');
    if (backdrop) {
      await userEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should show description character count', () => {
    render(
      <TaskModal isOpen={true} mode="create" onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    expect(screen.getByText('0/1000')).toBeInTheDocument();
  });

  it('should show status selector in edit mode', () => {
    const task = {
      id: 1, title: 'Task', description: null,
      status: TaskStatus.TODO,
      created_at: '2026-01-15T10:00:00Z',
      updated_at: '2026-01-15T10:00:00Z',
    };
    render(
      <TaskModal isOpen={true} mode="edit" task={task} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('should not show status selector in create mode', () => {
    render(
      <TaskModal isOpen={true} mode="create" onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
  });

  it('should show Saving... when isLoading', () => {
    render(
      <TaskModal isOpen={true} mode="create" onClose={mockOnClose} onSubmit={mockOnSubmit} isLoading />
    );
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });
});
