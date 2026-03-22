import { TaskStatus } from 'personal-task-tracker-core';
import {
  STATUS_LABELS,
  STATUS_BORDER_COLOR,
  COLUMN_CONFIG,
  COLUMNS,
} from './status-config';

describe('status-config', () => {
  describe('STATUS_LABELS', () => {
    it('should have labels for all statuses', () => {
      expect(STATUS_LABELS[TaskStatus.TODO]).toBe('To Do');
      expect(STATUS_LABELS[TaskStatus.IN_PROGRESS]).toBe('In Progress');
      expect(STATUS_LABELS[TaskStatus.DONE]).toBe('Done');
    });
  });

  describe('STATUS_BORDER_COLOR', () => {
    it('should have border colors for all statuses', () => {
      expect(STATUS_BORDER_COLOR[TaskStatus.TODO]).toContain('border-l-');
      expect(STATUS_BORDER_COLOR[TaskStatus.IN_PROGRESS]).toContain('border-l-');
      expect(STATUS_BORDER_COLOR[TaskStatus.DONE]).toContain('border-l-');
    });
  });

  describe('COLUMN_CONFIG', () => {
    it('should have config for all statuses', () => {
      for (const status of COLUMNS) {
        const config = COLUMN_CONFIG[status];
        expect(config.title).toBe(STATUS_LABELS[status]);
        expect(config.headerColor).toBeTruthy();
        expect(config.bgColor).toBeTruthy();
        expect(config.countColor).toBeTruthy();
      }
    });
  });

  describe('COLUMNS', () => {
    it('should contain all three statuses in order', () => {
      expect(COLUMNS).toEqual([
        TaskStatus.TODO,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
      ]);
    });
  });
});
