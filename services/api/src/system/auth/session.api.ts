import { endpoint } from "~/_endpoint";
import api from "~/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "~/_interface";

export const AuthAPI = {
  getList: async ({ params }: ListPayload) =>
    await api.get(`${endpoint}/system/session/list`, params).then(r => r.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api.get(`${endpoint}/system/session/detail/${id}`).then(r => r.data),

  create: async ({ params }: CreatePayload) =>
    await api.post(`${endpoint}/system/session/create`, params).then(r => r.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api.put(`${endpoint}/system/session/update/${id}`, params).then(r => r.data),

  delete: async ({ id }: DeletePayload) =>
    await api.delete(`${endpoint}/system/session/delete/${id}`).then(r => r.data),
};