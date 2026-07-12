import { ExamCreateForm } from './types';

export const EXAM_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'final', label: 'Cuối kỳ' },
  { value: 'midterm', label: 'Giữa kỳ' },
  { value: 'quiz', label: 'Kiểm tra nhanh' },
  { value: 'practice', label: 'Luyện tập' },
  { value: 'other', label: 'Khác' },
];

export const DEFAULT_FORM_VALUES: ExamCreateForm = {
  exam_name: '',
  exam_type: 'final',
  course_id: null,
  course_name: '',
  level_id: null,
  level_name: '',
  duration: 60,
  total_score: 100,
  passing_score: 60,
};
