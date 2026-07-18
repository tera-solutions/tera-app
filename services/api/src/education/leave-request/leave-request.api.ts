import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { CreatePayload, DetailPayload, ListPayload, UpdatePayload } from "@tera/api/_interface";

type ReasonPayload = { id: number | string; params: { rejection_reason: string } };
type ScheduleMakeupPayload = {
  makeupId: number | string;
  params: { makeup_lesson_id: number | string; status?: string };
};

/**
 * Khớp `LeaveRequestController` (`lib/app/Modules/Education/LeaveRequest/Router/api.php`)
 * — đơn xin nghỉ gắn với MỘT buổi học cụ thể (không phải quỹ phép năm): học viên xin
 * nghỉ 1 buổi (raise học bù) hoặc giáo viên xin nghỉ dạy 1 buổi.
 */
export const LeaveRequestAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/leave/list`, { ...params, ...params?.filters })
      .then((r) => r.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/leave/detail/${id}`)
      .then((r) => r.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/edu/leave/create`, params)
      .then((r) => r.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/leave/update/${id}`, params)
      .then((r) => r.data),

  approve: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/leave/approve/${id}`, {})
      .then((r) => r.data),

  reject: async ({ id, params }: ReasonPayload) =>
    await api
      .post(`${endpoint}/edu/leave/reject/${id}`, params)
      .then((r) => r.data),

  cancel: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/leave/cancel/${id}`, {})
      .then((r) => r.data),

  scheduleMakeup: async ({ makeupId, params }: ScheduleMakeupPayload) =>
    await api
      .post(`${endpoint}/edu/leave/makeup/schedule/${makeupId}`, params)
      .then((r) => r.data),
};
