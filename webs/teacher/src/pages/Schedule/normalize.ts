import { pick } from "_common/utils/pick";
import { normalizeSession } from "_common/normalize/schedule";

import type { ScheduleDetail } from "./_interface";

export { normalizeSession, normalizeSessions } from "_common/normalize/schedule";

export const normalizeSessionDetail = (raw: any): ScheduleDetail => {
  const base = normalizeSession(raw);
  const planId = pick(raw, ["lesson_plan.id", "lesson_plan_id", "lesson_id"]);
  const planTitle = pick(raw, [
    "lesson_plan.title",
    "lesson_plan.plan_name",
    "lesson_plan.name",
    "lesson_title",
  ]);
  return {
    ...base,
    lesson_plan:
      planId != null || planTitle
        ? { id: Number(planId ?? 0), title: planTitle ?? "" }
        : null,
    attendance_done: Boolean(
      pick(raw, ["attendance_done", "is_attendance_done", "attended"]),
    ),
  };
};
