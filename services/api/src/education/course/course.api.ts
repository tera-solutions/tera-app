
import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const CourseAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/course/list`, {...params, ...params?.filters})
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/course/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/edu/course/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/course/update/${id}`, params)
      .then((result) => result.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/edu/course/delete/${id}`)
      .then((result) => result.data),

  // Ngừng hoạt động (body { reason } tuỳ chọn) / kích hoạt lại (không body)
  suspend: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/course/suspend/${id}`, params)
      .then((result) => result.data),

  restore: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/course/restore/${id}`)
      .then((result) => result.data),
};
