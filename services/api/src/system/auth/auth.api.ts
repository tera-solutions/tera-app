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
    await api.get(`${endpoint}/system/auth/list`, params).then(r => r.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api.get(`${endpoint}/system/auth/detail/${id}`).then(r => r.data),

  create: async ({ params }: CreatePayload) =>
    await api.post(`${endpoint}/system/auth/create`, params).then(r => r.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api.put(`${endpoint}/system/auth/update/${id}`, params).then(r => r.data),

  delete: async ({ id }: DeletePayload) =>
    await api.delete(`${endpoint}/system/auth/delete/${id}`).then(r => r.data),
};