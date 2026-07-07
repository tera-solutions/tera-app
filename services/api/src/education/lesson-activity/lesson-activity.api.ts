import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

export type LessonActivityStatus = "pending" | "in_progress" | "completed";

export interface UpdateLessonActivityPayload {
  /** `edu_lesson_activities` row id. */
  id: number | string;
  status: LessonActivityStatus;
}

/**
 * Live lesson activities (`edu_lesson_activities`) — sub-resource of a lesson,
 * addressed by their own row id. Only the status transition is exposed here
 * (pending → in_progress → completed).
 */
export const LessonActivityAPI = {
  updateStatus: async ({ id, status }: UpdateLessonActivityPayload) =>
    await api
      .put(`${endpoint}/edu/lesson-activity/update/${id}`, { status })
      .then((r) => r.data),
};
