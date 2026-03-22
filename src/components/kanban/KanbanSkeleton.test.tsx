import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import KanbanSkeleton from './KanbanSkeleton';

describe('KanbanSkeleton', () => {
  it('should render default 3 skeleton items', () => {
    const { container } = render(<KanbanSkeleton />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons).toHaveLength(3);
  });

  it('should render specified count', () => {
    const { container } = render(<KanbanSkeleton count={5} />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons).toHaveLength(5);
  });

  it('should render 1 skeleton', () => {
    const { container } = render(<KanbanSkeleton count={1} />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons).toHaveLength(1);
  });
});
