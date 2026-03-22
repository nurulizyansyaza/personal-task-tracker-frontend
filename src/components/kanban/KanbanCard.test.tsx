import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import KanbanCard from './KanbanCard';
import { TaskStatus } from 'personal-task-tracker-core';
import { createMockTask } from '@/test/mocks';

// Mock @dnd-kit/sortable
jest.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => undefined } },
}));

const mockTask = createMockTask({
  id: 1,
  title: 'Test Task',
  description: 'Test description',
  status: TaskStatus.TODO,
});

describe('KanbanCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('should render task title and description', () => {
    render(<KanbanCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should render task date', () => {
    render(<KanbanCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('15 Jan')).toBeInTheDocument();
  });

  it('should render without description', () => {
    const noDescTask = { ...mockTask, description: null };
    render(<KanbanCard task={noDescTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  it('should apply line-through for done tasks', () => {
    const doneTask = { ...mockTask, status: TaskStatus.DONE };
    render(<KanbanCard task={doneTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    const title = screen.getByText('Test Task');
    expect(title.className).toContain('line-through');
  });

  it('should call onEdit when edit button is clicked', async () => {
    render(<KanbanCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    const editBtn = screen.getByTitle('Edit task');
    await userEvent.click(editBtn);
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('should call onDelete when delete button is clicked', async () => {
    render(<KanbanCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    const deleteBtn = screen.getByTitle('Delete task');
    await userEvent.click(deleteBtn);
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask);
  });

  it('should apply dragging styles when isDragging is true', () => {
    const { container } = render(
      <KanbanCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} isDragging />
    );
    const card = container.firstElementChild;
    expect(card?.className).toContain('opacity-50');
  });

  it('should render drag handle', () => {
    render(<KanbanCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByTitle('Drag to move')).toBeInTheDocument();
  });

  it('should render edit and delete buttons always visible (no hover required)', () => {
    const { container } = render(<KanbanCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    const editBtn = screen.getByTitle('Edit task');
    const deleteBtn = screen.getByTitle('Delete task');
    expect(editBtn.closest('[class*="opacity-0"]')).toBeNull();
    expect(deleteBtn.closest('[class*="opacity-0"]')).toBeNull();
  });

  describe('toggle done checkbox', () => {
    const mockOnToggleDone = jest.fn();

    beforeEach(() => mockOnToggleDone.mockClear());

    it('should render checkbox when onToggleDone is provided', () => {
      render(<KanbanCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} onToggleDone={mockOnToggleDone} />);
      expect(screen.getByTitle('Mark as done')).toBeInTheDocument();
    });

    it('should not render checkbox when onToggleDone is not provided', () => {
      render(<KanbanCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.queryByTitle('Mark as done')).not.toBeInTheDocument();
    });

    it('should call onToggleDone when checkbox is clicked', async () => {
      render(<KanbanCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} onToggleDone={mockOnToggleDone} />);
      await userEvent.click(screen.getByTitle('Mark as done'));
      expect(mockOnToggleDone).toHaveBeenCalledWith(mockTask);
    });

    it('should show checked state for done tasks', () => {
      const doneTask = { ...mockTask, status: TaskStatus.DONE };
      render(<KanbanCard task={doneTask} onEdit={mockOnEdit} onDelete={mockOnDelete} onToggleDone={mockOnToggleDone} />);
      expect(screen.getByTitle('Mark as to do')).toBeInTheDocument();
    });
  });
});
