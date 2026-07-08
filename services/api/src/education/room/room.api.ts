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

export const RoomAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/room/list`, { ...params, ...params?.filters })
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/room/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/edu/room/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/room/update/${id}`, params)
      .then((result) => result.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/edu/room/delete/${id}`)
      .then((result) => result.data),

  export: async ({ params }: ExportPayload) =>
    await api
      .post(`${endpoint}/edu/room/export`, params)
      .then((result) => result.data),

  suspend: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/room/suspend/${id}`, params)
      .then((result) => result.data),

  restore: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/room/restore/${id}`, params)
      .then((result) => result.data),

  getSummary: async (params?: Record<string, unknown>) =>
    await api
      .get(`${endpoint}/edu/room/summary`, params)
      .then((result) => result.data),
};
