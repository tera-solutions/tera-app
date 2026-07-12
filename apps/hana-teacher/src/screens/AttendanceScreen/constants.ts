import type { AttendanceApiStatus } from './types';

export const STATUS_ACTIONS: { status: AttendanceApiStatus; label: string }[] = [
  { status: 'present', label: 'Có mặt' },
  { status: 'late', label: 'Đi muộn' },
  { status: 'absent', label: 'Vắng mặt' },
];

export const SESSION_RANGE_MONTHS = 3;

export const WEEKDAY_LABEL: Record<number, string> = {
  2: 'T2',
  3: 'T3',
  4: 'T4',
  5: 'T5',
  6: 'T6',
  7: 'T7',
  8: 'CN',
};
