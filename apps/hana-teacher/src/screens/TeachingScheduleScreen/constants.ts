export const WEEKDAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/** Sun-first (matches `Date#getDay()`), for the "Thứ 5, 15/05/2025" header. */
export const WEEKDAY_FULL_BY_JS_DAY = [
  'Chủ nhật',
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
];

/** Raw `class_session_status` values are backend metadata (no fixed enum on
 * the frontend) — these are the commonly-seen ones; anything else falls back
 * to a neutral badge showing the raw value. */
export const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  upcoming: { label: 'Sắp diễn ra', bg: '#EFF6FF', color: '#3B82F6' },
  ongoing: { label: 'Đang diễn ra', bg: '#ECFDF5', color: '#10B981' },
  done: { label: 'Đã hoàn thành', bg: '#F5F3FF', color: '#8B5CF6' },
  cancelled: { label: 'Đã hủy', bg: '#FEF2F2', color: '#EF4444' },
};

export const DEFAULT_STATUS_META = { label: 'Chưa bắt đầu', bg: '#F1F5F9', color: '#64748B' };

/** Deterministic colour per class so the same class keeps its colour, mirrors the web's `getClassColor`. */
const CLASS_PALETTE = [
  { bg: '#EFF6FF', text: '#1D4ED8', indicator: '#3B82F6' },
  { bg: '#ECFDF5', text: '#047857', indicator: '#10B981' },
  { bg: '#FFF7ED', text: '#C2410C', indicator: '#F97316' },
  { bg: '#F5F3FF', text: '#6D28D9', indicator: '#8B5CF6' },
  { bg: '#FDF2F8', text: '#BE185D', indicator: '#EC4899' },
  { bg: '#ECFEFF', text: '#0E7490', indicator: '#06B6D4' },
];

export const getClassColor = (classId: number) => CLASS_PALETTE[Math.abs(classId) % CLASS_PALETTE.length];
