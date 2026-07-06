import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { DetailPayload, UpdatePayload } from "@tera/api/_interface";

export type LessonPlanLessonActivityStatus =
  | "pending"
  | "in_progress"
  | "completed";

export interface LessonPlanLessonActivityParams {
  avatar?: string;
  title: string;
  description?: string;
  duration?: number;
  status?: LessonPlanLessonActivityStatus;
}

export interface LessonPlanLessonParams {
  lesson_no?: number;
  lesson_title: string;
  objective?: string;
  vocabulary?: string;
  grammar?: string;
  homework?: string;
  duration?: number;
  activities?: LessonPlanLessonActivityParams[];
}

/**
 * Lesson templates (`edu_lesson_plan_lessons`) — sub-resource of a lesson
 * plan, addressed by the plan id on create/reorder and by their own id on
 * update/delete.
 */
export const LessonPlanLessonAPI = {
  create: async ({ id: planId, params }: UpdatePayload<LessonPlanLessonParams>) =>
    await api
      .post(`${endpoint}/edu/lesson-plan/lesson/create/${planId}`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload<LessonPlanLessonParams>) =>
    await api
      .put(`${endpoint}/edu/lesson-plan/lesson/update/${id}`, params)
      .then((result) => result.data),

  delete: async ({ id }: DetailPayload) =>
    await api
      .delete(`${endpoint}/edu/lesson-plan/lesson/delete/${id}`)
      .then((result) => result.data),

  reorder: async ({ id: planId, params }: UpdatePayload<{ lesson_ids: (number | string)[] }>) =>
    await api
      .post(`${endpoint}/edu/lesson-plan/lesson/reorder/${planId}`, params)
      .then((result) => result.data),
};
