
import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const EvaluationAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/evaluation/list`, {...params, ...params?.filters})
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/evaluation/detail/${id}`)
      .then((result) => result.data),

  getStudentSummary: async (params?: Record<string, unknown>) =>
    await api
      .get(`${endpoint}/edu/evaluation/student-summary`, params)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/edu/evaluation/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/evaluation/update/${id}`, params)
      .then((result) => result.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/edu/evaluation/delete/${id}`)
      .then((result) => result.data),

  // Gửi duyệt đánh giá (không body)
  submit: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/evaluation/submit/${id}`)
      .then((result) => result.data),

  // Duyệt đánh giá (không body)
  approve: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/evaluation/approve/${id}`)
      .then((result) => result.data),

  // Từ chối đánh giá (không body)
  reject: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/evaluation/reject/${id}`)
      .then((result) => result.data),

  // Khoá đánh giá (chốt, không cho sửa — không body)
  lock: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/evaluation/lock/${id}`)
      .then((result) => result.data),
};
