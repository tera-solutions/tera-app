import type { AssignmentType } from '@screens/AssignmentScreen/types';

export interface AssignmentCreateForm {
  assignment_name: string;
  assignment_type: AssignmentType;
  max_score: number;
  description: string;
  instruction: string;
  /** Date part only ("YYYY-MM-DD") — see `_utils.ts#toDueDateParam` for how the time is filled in. */
  due_date: string;
  course_id: number | null;
  course_name: string;
  class_room_id: number | null;
  class_room_name: string;
  lesson_id: number | null;
  lesson_name: string;
  level_id: number | null;
  level_name: string;
  allow_late_submission: boolean;
  allow_multiple_submission: boolean;
}

export interface PickerOption {
  value: number;
  label: string;
}
