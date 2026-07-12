export interface PickerOption {
  value: number;
  label: string;
}

export interface ExamCreateForm {
  exam_name: string;
  exam_type: string;
  course_id: number | null;
  course_name?: string;
  level_id: number | null;
  level_name?: string;
  duration: number;
  total_score: number;
  passing_score: number;
}
