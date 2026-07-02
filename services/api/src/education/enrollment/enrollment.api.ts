import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const EnrollmentAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/enrollment/list`, { ...params, ...params?.filters })
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/enrollment/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/edu/enrollment/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/enrollment/update/${id}`, params)
      .then((result) => result.data),

  suspend: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/enrollment/suspend/${id}`, params)
      .then((result) => result.data),

  transfer: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/enrollment/transfer/${id}`, params)
      .then((result) => result.data),

  refund: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/enrollment/refund/${id}`)
      .then((result) => result.data),

  cancel: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/enrollment/cancel/${id}`, params)
      .then((result) => result.data),
};
