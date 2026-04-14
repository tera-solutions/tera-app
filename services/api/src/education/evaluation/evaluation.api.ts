
import { endpoint } from "~/_endpoint";
import api from "~/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "~/_interface";

export const EvaluationAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/evaluation/list`, params)
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/evaluation/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/edu/evaluation/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/evaluation/update/${id}`, params)
      .then((result) => result.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/edu/evaluation/delete/${id}`)
      .then((result) => result.data),
};
