import { CourseFormValues } from './types';

export const COURSE_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'active', label: 'Đang mở' },
  { value: 'inactive', label: 'Ngừng hoạt động' },
];

export const DEFAULT_FORM_VALUES: CourseFormValues = {
  name: '',
  code: '',
  duration_minutes: '',
  price_per_lesson: '',
  description: '',
  status: 'active',
};
