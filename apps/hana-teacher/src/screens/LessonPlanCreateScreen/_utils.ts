import type {
  LessonPlanLessonActivityParams,
  LessonPlanLessonParams,
} from '@tera/api/education/lesson-plan-lesson';

import type { ActivityForm, LessonTemplateForm } from './types';

/** Textarea shows one objective per line; the backend stores them ";"-joined. */
export const joinObjective = (value: string): string =>
  value
    .split(/\r?\n/)
    .map((v) => v.trim())
    .filter(Boolean)
    .join(';');

export const emptyActivity = (): ActivityForm => ({
  title: '',
  description: '',
  duration: undefined,
  status: 'pending',
});

export const emptyTemplate = (): LessonTemplateForm => ({
  lesson_title: '',
  objective: '',
  vocabulary: '',
  grammar: '',
  homework: '',
  duration: 90,
  activities: [],
});

const toActivityParams = (activity: ActivityForm): LessonPlanLessonActivityParams => ({
  title: activity.title.trim(),
  description: activity.description.trim() || undefined,
  duration: activity.duration || undefined,
  status: activity.status,
});

export const toTemplateParams = (template: LessonTemplateForm): LessonPlanLessonParams => ({
  lesson_title: template.lesson_title.trim(),
  objective: joinObjective(template.objective) || undefined,
  vocabulary: template.vocabulary.trim() || undefined,
  grammar: template.grammar.trim() || undefined,
  homework: template.homework.trim() || undefined,
  duration: template.duration || undefined,
  activities: template.activities
    .filter((a) => a.title.trim())
    .map(toActivityParams),
});
