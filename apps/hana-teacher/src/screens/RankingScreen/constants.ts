import type { RankingTab } from './types';

export const RANKING_TABS: { key: RankingTab; label: string }[] = [
  { key: 'overall', label: 'Tổng hợp' },
  { key: 'progress', label: 'Tiến bộ' },
  { key: 'group', label: 'Nhóm' },
  { key: 'evaluation', label: 'Đánh giá' },
];

export const MEDAL_COLOR = ['#FACC15', '#94A3B8', '#D97706'];
