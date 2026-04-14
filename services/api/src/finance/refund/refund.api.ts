
import { endpoint } from "~/_endpoint";
import api from "~/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "~/_interface";

export const RefundAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/fin/refund/list`, params)
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/fin/refund/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/fin/refund/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/fin/refund/update/${id}`, params)
      .then((result) => result.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/fin/refund/delete/${id}`)
      .then((result) => result.data),
};
