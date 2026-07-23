export type WizardActivityStatus = "pending" | "in_progress" | "completed";

export interface WizardActivity {
  id?: number | string;
  avatar: string;
  title: string;
  description: string;
  duration: number | undefined;
  status: WizardActivityStatus;
}

/** A bank material (`/materials`) staged to be attached to this lesson once
 * it's actually created — see StepReviewCreate's final-submit attach loop. */
export interface WizardMaterial {
  material_id: number | string;
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
