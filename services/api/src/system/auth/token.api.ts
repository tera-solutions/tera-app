import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const AuthAPI = {
  getList: async ({ params }: ListPayload) =>
    await api.get(`${endpoint}/system/token/list`, params).then(r => r.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api.get(`${endpoint}/system/token/detail/${id}`).then(r => r.data),

  create: async ({ params }: CreatePayload) =>
    await api.post(`${endpoint}/system/token/create`, params).then(r => r.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api.put(`${endpoint}/system/token/update/${id}`, params).then(r => r.data),

  delete: async ({ id }: DeletePayload) =>
    await api.delete(`${endpoint}/system/token/delete/${id}`).then(r => r.data),
};