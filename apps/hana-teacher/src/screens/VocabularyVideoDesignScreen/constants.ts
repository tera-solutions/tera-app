// Bước 2/4 ("Thiết kế") của luồng tạo video từ vựng. Không có API/dữ liệu
// thiết kế thật (cùng lý do đã ghi ở VocabularyVideoCreateScreen/constants.ts
// — chưa có video API nào). Điều hướng từ bước 1 sang đây chỉ chuyển màn,
// CHƯA truyền dữ liệu đã nhập ở bước 1 sang (chưa có state/Context dùng
// chung giữa các bước) nên khối "Xem trước" dùng 1 từ mẫu cố định ("Cat") để
// minh hoạ hiệu ứng giao diện/màu nền/kiểu chữ/vị trí chữ đang chọn.
export interface VideoTheme {
  id: string;
  label: string;
  bg: string;
  accent: string;
}

export const VIDEO_THEMES: VideoTheme[] = [
  { id: 'classic', label: 'Cổ điển', bg: '#1E3A8A', accent: '#FDE68A' },
  { id: 'fun', label: 'Vui nhộn', bg: '#F97316', accent: '#FFFFFF' },
  { id: 'minimal', label: 'Tối giản', bg: '#F8FAFC', accent: '#0F172A' },
  { id: 'nature', label: 'Thiên nhiên', bg: '#166534', accent: '#FEF9C3' },
];

export const BACKGROUND_COLORS = [
  '#2563EB',
  '#16A34A',
  '#F97316',
  '#DB2777',
  '#7C3AED',
  '#0EA5E9',
  '#1E293B',
  '#F8FAFC',
];

export interface FontStyleOption {
  id: string;
  label: string;
  fontWeight: '500' | '600' | '700' | '800';
  fontStyle?: 'italic';
  letterSpacing?: number;
}

// Không có font tuỳ biến thật đi kèm app — dùng fontWeight/letterSpacing/
// fontStyle khác nhau để MÔ PHỎNG cảm giác khác nhau giữa các kiểu chữ, chưa
// phải là các font chữ thật riêng biệt.
export const FONT_STYLES: FontStyleOption[] = [
  { id: 'modern', label: 'Hiện đại', fontWeight: '700' },
  { id: 'cute', label: 'Dễ thương', fontWeight: '600', letterSpacing: 0.5 },
  { id: 'classic', label: 'Cổ điển', fontWeight: '800', letterSpacing: 1 },
  { id: 'handwritten', label: 'Viết tay', fontWeight: '600', fontStyle: 'italic' },
];

export type TextPosition = 'above' | 'below' | 'overlay';

export const TEXT_POSITIONS: { id: TextPosition; label: string }[] = [
  { id: 'above', label: 'Trên hình' },
  { id: 'below', label: 'Dưới hình' },
  { id: 'overlay', label: 'Đè lên hình' },
];

export const PREVIEW_SAMPLE = {
  word: 'Cat',
  phonetic: '/kæt/',
  meaning: 'Con mèo',
};
