export type ActivityStatus = 'pending' | 'in_progress' | 'completed';

export const ACTIVITY_STATUS_OPTIONS: { value: ActivityStatus; label: string }[] = [
  { value: 'pending', label: 'Chưa bắt đầu' },
  { value: 'in_progress', label: 'Đang thực hiện' },
  { value: 'completed', label: 'Hoàn thành' },
];

export interface ActivityForm {
  title: string;
  description: string;
  duration: number | undefined;
  status: ActivityStatus;
}

export interface LessonTemplateForm {
  lesson_title: string;
  /** Textarea value, one objective per line; joined with ";" for the API. */
  objective: string;
  vocabulary: string;
  grammar: string;
  homework: string;
  duration: number | undefined;
  activities: ActivityForm[];
}

export interface PlanInfoForm {
  plan_code: string;
  plan_name: string;
  course_id: number | null;
  course_name: string;
  level_id: number | null;
  level_name: string;
  description: string;
}

export interface PickerOption {
  value: number;
  label: string;
}
