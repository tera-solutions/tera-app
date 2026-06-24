import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

/**
 * Parent ↔ Student links — route backend `crm/parent-student/*`.
 * Dùng để gắn/bỏ liên kết phụ huynh (ĐÃ tồn tại) với học viên + quan hệ.
 * Body create/update: { parent_id, student_id, relation }.
 */
export const ParentStudentAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/crm/parent-student/list`, {
        ...params,
        ...params?.filters,
      })
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/crm/parent-student/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/crm/parent-student/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/crm/parent-student/update/${id}`, params)
      .then((result) => result.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/crm/parent-student/delete/${id}`)
      .then((result) => result.data),
};
