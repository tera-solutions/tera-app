import type {
  LessonPlanLessonActivityParams,
  LessonPlanLessonParams,
} from "@tera/api/education/lesson-plan-lesson";

import type {
  WizardActivity,
  WizardLessonTemplate,
  WizardMaterial,
} from "./_interface";

/** Textarea shows one objective per line; the backend stores them ";"-joined. */
export const splitObjective = (value: unknown): string =>
  typeof value === "string"
    ? value
        .split(";")
        .map((v) => v.trim())
        .filter(Boolean)
        .join("\n")
    : "";

export const joinObjective = (value: string): string =>
  value
    .split(/\r?\n/)
    .map((v) => v.trim())
    .filter(Boolean)
    .join(";");

const toActivity = (raw: any): WizardActivity => ({
  id: raw?.id,
  avatar: raw?.avatar_url ?? raw?.avatar ?? "",
  title: raw?.title ?? "",
  description: raw?.description ?? "",
  duration: raw?.duration ?? undefined,
  status: (raw?.status as WizardActivity["status"]) ?? "pending",
});

const toMaterial = (raw: any, index: number): WizardMaterial => ({
  material_id: raw?.material_id ?? raw?.id ?? index,
  name: raw?.name ?? raw?.material_name ?? `Tài liệu ${index + 1}`,
});

export const toWizardTemplate = (raw: any): WizardLessonTemplate => ({
  id: raw?.id,
  lesson_no: raw?.lesson_no,
  lesson_title: raw?.lesson_title ?? "",
  objective: splitObjective(raw?.objective),
  vocabulary: raw?.vocabulary ?? "",
  grammar: raw?.grammar ?? "",
  homework: raw?.homework ?? "",
  duration: raw?.duration ?? undefined,
  activities: Array.isArray(raw?.activities) ? raw.activities.map(toActivity) : [],
  materials: Array.isArray(raw?.materials) ? raw.materials.map(toMaterial) : [],
});

export const toWizardTemplates = (
  raw: any[] | null | undefined,
): WizardLessonTemplate[] => (raw ?? []).map(toWizardTemplate);

export const emptyActivity = (): WizardActivity => ({
  avatar: "",
  title: "",
  description: "",
  duration: undefined,
  status: "pending",
});

export const emptyTemplate = (): WizardLessonTemplate => ({
  lesson_title: "",
  objective: "",
  vocabulary: "",
  grammar: "",
  homework: "",
  duration: 90,
  activities: [],
  materials: [],
});

const toActivityParams = (
  activity: WizardActivity,
): LessonPlanLessonActivityParams => ({
  avatar: activity.avatar.trim() || undefined,
  title: activity.title.trim(),
  description: activity.description.trim() || undefined,
  duration: activity.duration || undefined,
  status: activity.status,
});

/**
 * `includeActivities: false` omits the `activities` key entirely so the
 * backend's full-replace sync is skipped — used once a lesson has a real id
 * and its activities are edited individually via the activity endpoints
 * instead of being bundled into the lesson payload.
 */
export const toTemplateParams = (
  template: WizardLessonTemplate,
  options?: { includeActivities?: boolean },
): LessonPlanLessonParams => ({
  lesson_title: template.lesson_title.trim(),
  objective: joinObjective(template.objective) || undefined,
  vocabulary: template.vocabulary.trim() || undefined,
  grammar: template.grammar.trim() || undefined,
  homework: template.homework.trim() || undefined,
  duration: template.duration || undefined,
  ...((options?.includeActivities ?? true)
    ? {
        activities: template.activities
          .filter((a) => a.title.trim())
          .map(toActivityParams),
      }
    : {}),
});
