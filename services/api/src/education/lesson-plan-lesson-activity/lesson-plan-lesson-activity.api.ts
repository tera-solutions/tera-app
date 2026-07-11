import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";
import { LessonPlanLessonActivityStatus } from "../lesson-plan-lesson/lesson-plan-lesson.api";

export interface CreateLessonPlanLessonActivityParams {
  lesson_plan_lesson_id: number | string;
  sort_order?: number;
  avatar?: string;
  title: string;
  description?: string;
  duration?: number;
  status?: LessonPlanLessonActivityStatus;
}

export type UpdateLessonPlanLessonActivityParams = Partial<
  Omit<CreateLessonPlanLessonActivityParams, "lesson_plan_lesson_id">
>;

/**
 * Individual activities (Warm-up/Presentation/Practice/...) within a
 * lesson-plan-lesson template — addressable on their own, without resending
 * the whole lesson. Subject to the same editability rule as the lesson
 * (draft plan, not linked to a class).
 */
export const LessonPlanLessonActivityAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/lesson-plan/lesson-activity/list`, params)
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/lesson-plan/lesson-activity/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload<CreateLessonPlanLessonActivityParams>) =>
    await api
      .post(`${endpoint}/edu/lesson-plan/lesson-activity/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload<UpdateLessonPlanLessonActivityParams>) =>
    await api
      .put(`${endpoint}/edu/lesson-plan/lesson-activity/update/${id}`, params)
      .then((result) => result.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/edu/lesson-plan/lesson-activity/delete/${id}`)
      .then((result) => result.data),
};
