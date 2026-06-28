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

export const MaterialAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/material/list`, { ...params, ...params?.filters })
      .then((r) => r.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/material/detail/${id}`)
      .then((r) => r.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/edu/material/create`, params)
      .then((r) => r.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/material/update/${id}`, params)
      .then((r) => r.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/edu/material/delete/${id}`)
      .then((r) => r.data),

  export: async ({ params }: ExportPayload) =>
    await api
      .post(`${endpoint}/edu/material/export`, params)
      .then((r) => r.data),
};
