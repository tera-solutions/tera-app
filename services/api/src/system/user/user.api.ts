import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const UserAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/sys/user/list`, { ...params, ...params?.filters })
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/sys/user/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/sys/user/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/sys/user/update/${id}`, params)
      .then((result) => result.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/sys/user/delete/${id}`)
      .then((result) => result.data),

  activate: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/sys/user/activate/${id}`)
      .then((result) => result.data),

  deactivate: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/sys/user/deactivate/${id}`)
      .then((result) => result.data),

  unlock: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/sys/user/unlock/${id}`)
      .then((result) => result.data),

  resetPassword: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/sys/user/reset-password/${id}`)
      .then((result) => result.data),
};
