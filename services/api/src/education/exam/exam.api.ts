import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const ExamAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/exam/list`, { ...params, ...params?.filters })
      .then((r) => r.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/exam/detail/${id}`)
      .then((r) => r.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/edu/exam/create`, params)
      .then((r) => r.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/exam/update/${id}`, params)
      .then((r) => r.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/edu/exam/delete/${id}`)
      .then((r) => r.data),

  export: async ({ params }: ExportPayload) =>
    await api
      .post(`${endpoint}/edu/exam/export`, params)
      .then((r) => r.data),

  addQuestion: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/exam/question/create/${id}`, params)
      .then((r) => r.data),

  updateQuestion: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/exam/question/update/${id}`, params)
      .then((r) => r.data),

  deleteQuestion: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/edu/exam/question/delete/${id}`)
      .then((r) => r.data),
};
