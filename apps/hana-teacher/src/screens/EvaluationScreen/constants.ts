import type { PanelTab, StudentSkills } from './types';

export const PANEL_TABS: { key: PanelTab; label: string }[] = [
  { key: 'overview', label: 'Tổng quan' },
  { key: 'comments', label: 'Nhận xét' },
];

export const SKILL_META: { key: keyof StudentSkills; label: string; icon: string }[] = [
  { key: 'listening', label: 'Nghe (Listening)', icon: 'ear-hearing' },
  { key: 'speaking', label: 'Nói (Speaking)', icon: 'microphone-outline' },
  { key: 'reading', label: 'Đọc (Reading)', icon: 'book-open-outline' },
  { key: 'writing', label: 'Viết (Writing)', icon: 'pencil-outline' },
];
