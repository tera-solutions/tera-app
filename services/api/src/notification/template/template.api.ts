
import { endpoint } from "~/_endpoint";
import api from "~/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "~/_interface";

export const TemplateAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/sys/template/list`, params)
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/sys/template/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/sys/template/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/sys/template/update/${id}`, params)
      .then((result) => result.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/sys/template/delete/${id}`)
      .then((result) => result.data),
};
