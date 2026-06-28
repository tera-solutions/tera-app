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

export const AssignmentAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/assignment/list`, { ...params, ...params?.filters })
      .then((r) => r.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/assignment/detail/${id}`)
      .then((r) => r.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/edu/assignment/create`, params)
      .then((r) => r.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/assignment/update/${id}`, params)
      .then((r) => r.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/edu/assignment/delete/${id}`)
      .then((r) => r.data),

  export: async ({ params }: ExportPayload) =>
    await api
      .post(`${endpoint}/edu/assignment/export`, params)
      .then((r) => r.data),
};
