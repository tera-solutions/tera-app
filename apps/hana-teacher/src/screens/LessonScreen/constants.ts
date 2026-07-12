import type { LessonActivityStatus, LessonApiStatus, LessonDetailTab } from './types';

export const DETAIL_TABS: { key: LessonDetailTab; label: string }[] = [
  { key: 'overview', label: 'Tổng quan' },
  { key: 'materials', label: 'Tài liệu' },
  { key: 'homework', label: 'Bài tập' },
];

export const LESSON_STATUS_CONFIG: Record<
  LessonApiStatus,
  { label: string; color: string; bg: string; icon: string }
> = {
  completed: { label: 'Đã giảng', color: '#27AE60', bg: '#E2FBEB', icon: 'check-circle' },
  upcoming: { label: 'Sắp tới', color: '#007AFF', bg: '#EBF5FF', icon: 'clock-outline' },
  ongoing: { label: 'Đang diễn ra', color: '#E67E22', bg: '#FFF4EB', icon: 'play-circle-outline' },
  cancelled: { label: 'Đã hủy', color: '#E74C3C', bg: '#FDF2F0', icon: 'close-circle-outline' },
};

export const ACTIVITY_STATUS_CONFIG: Record<
  LessonActivityStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: 'Chưa bắt đầu', color: '#64748B', bg: '#F1F5F9' },
  in_progress: { label: 'Đang diễn ra', color: '#007AFF', bg: '#EBF5FF' },
  completed: { label: 'Hoàn thành', color: '#27AE60', bg: '#E2FBEB' },
};

export const MATERIAL_STYLE: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  pdf: { icon: 'file-pdf-box', color: '#E74C3C', bg: '#FDF2F0', label: 'PDF' },
  doc: { icon: 'file-word-box', color: '#2980B9', bg: '#EEF6FA', label: 'DOC' },
  docx: { icon: 'file-word-box', color: '#2980B9', bg: '#EEF6FA', label: 'DOC' },
  ppt: { icon: 'file-powerpoint-box', color: '#E67E22', bg: '#FFF4EB', label: 'PPT' },
  pptx: { icon: 'file-powerpoint-box', color: '#E67E22', bg: '#FFF4EB', label: 'PPT' },
  mp3: { icon: 'file-music-outline', color: '#8E44AD', bg: '#F5EFFF', label: 'MP3' },
  mp4: { icon: 'file-video-outline', color: '#9B5DE5', bg: '#F5EFFF', label: 'MP4' },
  jpg: { icon: 'file-image-outline', color: '#007AFF', bg: '#EBF5FF', label: 'IMG' },
  jpeg: { icon: 'file-image-outline', color: '#007AFF', bg: '#EBF5FF', label: 'IMG' },
  png: { icon: 'file-image-outline', color: '#007AFF', bg: '#EBF5FF', label: 'IMG' },
};

export const DEFAULT_MATERIAL_STYLE = { icon: 'file-outline', color: '#64748B', bg: '#F1F5F9', label: 'FILE' };

/** Debounce window before the personal note auto-saves (ms). */
export const NOTE_AUTOSAVE_DELAY = 2000;
export const NOTE_MAX_LENGTH = 2000;

/** The 4 skill criteria added to `EvaluationType::criteria()` for `student` type. */
export const SKILL_KEYS = ['listening', 'speaking', 'reading', 'writing'] as const;
export type SkillKey = (typeof SKILL_KEYS)[number];

export const SKILL_LABEL: Record<SkillKey, string> = {
  listening: 'Nghe',
  speaking: 'Nói',
  reading: 'Đọc',
  writing: 'Viết',
};

export const DEFAULT_SKILL_SCORE = 3;

export const ASSIGNMENT_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Nháp', color: '#64748B', bg: '#F1F5F9' },
  published: { label: 'Đã giao', color: '#27AE60', bg: '#E2FBEB' },
  closed: { label: 'Đã đóng', color: '#94A3B8', bg: '#F1F5F9' },
};
