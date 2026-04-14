
import { endpoint } from "~/_endpoint";
import api from "~/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "~/_interface";

export const WalletTransactionAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/fin/wallet-transaction/list`, params)
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/fin/wallet-transaction/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/fin/wallet-transaction/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/fin/wallet-transaction/update/${id}`, params)
      .then((result) => result.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/fin/wallet-transaction/delete/${id}`)
      .then((result) => result.data),
};
