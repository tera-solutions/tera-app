export type WizardActivityStatus = "pending" | "in_progress" | "completed";

export interface WizardActivity {
  id?: number | string;
  avatar: string;
  title: string;
  description: string;
  duration: number | undefined;
  status: WizardActivityStatus;
}

export interface WizardMaterial {
  id: number | string;
  file_id: number | string;
  material_type: string;
  name: string;
}

export interface WizardLessonTemplate {
  id?: number;
  lesson_no?: number;
  lesson_title: string;
  /** Textarea value, one objective per line; joined with ";" for the API. */
  objective: string;
  vocabulary: string;
  grammar: string;
  homework: string;
  duration: number | undefined;
  activities: WizardActivity[];
  materials: WizardMaterial[];
}
