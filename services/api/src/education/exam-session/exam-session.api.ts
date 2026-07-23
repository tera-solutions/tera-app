import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { DetailPayload, ListPayload } from "@tera/api/_interface";

export const ExamSessionAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/exam-session/list`, { ...params, ...params?.filters })
      .then((r) => r.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/exam-session/detail/${id}`)
      .then((r) => r.data),

  create: async ({ params }: { params: any }) =>
    await api.post(`${endpoint}/edu/exam-session/create`, params).then((r) => r.data),

  update: async ({ id, params }: { id: number | string; params: any }) =>
    await api.put(`${endpoint}/edu/exam-session/update/${id}`, params).then((r) => r.data),

  delete: async ({ id }: { id: number | string }) =>
    await api.delete(`${endpoint}/edu/exam-session/delete/${id}`).then((r) => r.data),

  registerByClass: async ({ id, params }: { id: number | string; params: { class_room_id: number } }) =>
    await api
      .post(`${endpoint}/edu/exam-session/register/class/${id}`, params)
      .then((r) => r.data),

  registerByStudent: async ({ id, params }: { id: number | string; params: { student_ids: number[] } }) =>
    await api
      .post(`${endpoint}/edu/exam-session/register/student/${id}`, params)
      .then((r) => r.data),
};
