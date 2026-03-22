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
});
