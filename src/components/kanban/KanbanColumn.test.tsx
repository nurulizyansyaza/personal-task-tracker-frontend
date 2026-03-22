import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import KanbanColumn from './KanbanColumn';
import { TaskStatus } from 'personal-task-tracker-core';
import { createMockTask } from '@/test/mocks';
import userEvent from '@testing-library/user-event';

// Mock dnd-kit
jest.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({ setNodeRef: jest.fn(), isOver: false }),
}));

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
  verticalListSortingStrategy: {},
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

const mockTasks = [
  createMockTask({ id: 1, title: 'Task 1' }),
  createMockTask({ id: 2, title: 'Task 2', description: 'Desc' }),
];

describe('KanbanColumn', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnAdd = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('should render column header with title and count', () => {
    render(
      <KanbanColumn status={TaskStatus.TODO} tasks={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render In Progress column', () => {
    render(
      <KanbanColumn status={TaskStatus.IN_PROGRESS} tasks={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render Done column', () => {
    render(
      <KanbanColumn status={TaskStatus.DONE} tasks={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('should render task cards', () => {
    render(
      <KanbanColumn status={TaskStatus.TODO} tasks={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('should show empty message when no tasks (TODO)', () => {
    render(
      <KanbanColumn status={TaskStatus.TODO} tasks={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    expect(screen.getByText('No tasks yet — add one!')).toBeInTheDocument();
  });

  it('should show drag message for empty non-TODO columns', () => {
    render(
      <KanbanColumn status={TaskStatus.IN_PROGRESS} tasks={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    expect(screen.getByText('Drag tasks here')).toBeInTheDocument();
  });

  it('should show add button for TODO column when onAdd provided', async () => {
    render(
      <KanbanColumn status={TaskStatus.TODO} tasks={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} onAdd={mockOnAdd} />
    );
    const addBtn = screen.getByTitle('Add new task');
    await userEvent.click(addBtn);
    expect(mockOnAdd).toHaveBeenCalled();
  });

  it('should show loading skeletons when isLoading', () => {
    const { container } = render(
      <KanbanColumn status={TaskStatus.TODO} tasks={[]} isLoading onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
