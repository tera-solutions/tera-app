import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

/**
 * Lesson (Bài học), KHÔNG phải CRUD generic:
 * list / detail / generate / update / reschedule / cancel / complete / lock / unlock.
 * Bài học được SINH (generate) theo lớp, không tạo lẻ; xóa = hủy (cancel).
 */
export const LessonAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/lesson/list`, { ...params, ...params?.filters })
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/lesson/detail/${id}`)
      .then((result) => result.data),

  // Sinh bài học cho 1 lớp — id = classId
  generate: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/lesson/generate/${id}`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/lesson/update/${id}`, params)
      .then((result) => result.data),

  // Đổi lịch (ngày + giờ) 1 bài học
  reschedule: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/lesson/reschedule/${id}`, params)
      .then((result) => result.data),

  // Đổi giáo án / bài học (lesson_plan_id, lesson_plan_lesson_id?) cho 1 buổi học đã sinh
  changePlan: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/lesson/change-plan/${id}`, params)
      .then((result) => result.data),

  // Hủy buổi học (kèm lý do)
  cancel: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/lesson/cancel/${id}`, params)
      .then((result) => result.data),

  // Kết thúc buổi học — KHÔNG body
  complete: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/lesson/complete/${id}`)
      .then((result) => result.data),

  // Khóa buổi học — KHÔNG body (chỉ khóa được buổi đã hoàn thành)
  lock: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/lesson/lock/${id}`)
      .then((result) => result.data),

  // Mở khóa — cần lý do
  unlock: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/lesson/unlock/${id}`, params)
      .then((result) => result.data),
};
