import type { AssignmentType } from '@screens/AssignmentScreen/types';
import type { AssignmentCreateForm } from './types';

export const ASSIGNMENT_TYPE_OPTIONS: { value: AssignmentType; label: string }[] = [
  { value: 'homework', label: 'Bài tập về nhà' },
  { value: 'worksheet', label: 'Phiếu bài tập' },
  { value: 'quiz', label: 'Trắc nghiệm nhanh' },
  { value: 'writing', label: 'Viết' },
  { value: 'speaking', label: 'Nói' },
  { value: 'listening', label: 'Nghe' },
  { value: 'reading', label: 'Đọc' },
  { value: 'project', label: 'Dự án' },
  { value: 'exam_practice', label: 'Luyện thi' },
];

export const DEFAULT_FORM_VALUES: AssignmentCreateForm = {
  assignment_name: '',
  assignment_type: 'homework',
  max_score: 10,
  description: '',
  instruction: '',
  due_date: '',
  course_id: null,
  course_name: '',
  class_room_id: null,
  class_room_name: '',
  lesson_id: null,
  lesson_name: '',
  level_id: null,
  level_name: '',
  allow_late_submission: false,
  allow_multiple_submission: false,
};
