import type { AssignmentCreateForm } from './types';

/**
 * Mobile only asks for a due *date* (no time-of-day picker available yet —
 * `@components/ui/DateTime` wraps `DatePickerInput`, not a time input), so
 * every assignment is due at end-of-day. Matches the `"YYYY-MM-DD HH:mm:ss"`
 * format the API expects (see web's `Form/index.tsx#DATE_FORMAT`).
 */
export const toDueDateParam = (dateOnly: string): string => (dateOnly ? `${dateOnly} 23:59:59` : '');

/** Fields accepted by the create endpoint (assignment.md §VI). */
export const toBasePayload = (values: AssignmentCreateForm) => ({
  assignment_name: values.assignment_name.trim(),
  assignment_type: values.assignment_type,
  instruction: values.instruction.trim(),
  max_score: values.max_score,
  due_date: toDueDateParam(values.due_date),
});

/** Scope + submission-policy fields — only accepted by the update endpoint. */
export const toAssignPayload = (values: AssignmentCreateForm) => ({
  course_id: values.course_id ?? undefined,
  class_room_id: values.class_room_id ?? undefined,
  level_id: values.level_id ?? undefined,
  lesson_id: values.lesson_id ?? undefined,
  description: values.description.trim() || undefined,
  allow_late_submission: values.allow_late_submission,
  allow_multiple_submission: values.allow_multiple_submission,
});

export const hasAssignmentScope = (values: AssignmentCreateForm): boolean =>
  !!(
    values.course_id ||
    values.class_room_id ||
    values.level_id ||
    values.lesson_id ||
    values.description.trim() ||
    values.allow_late_submission ||
    values.allow_multiple_submission
  );
