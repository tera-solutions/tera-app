import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const LeadAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/crm/lead/list`, { ...params, ...params?.filters })
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/crm/lead/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/crm/lead/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/crm/lead/update/${id}`, params)
      .then((result) => result.data),

  suspend: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/crm/lead/suspend/${id}`, params)
      .then((result) => result.data),

  restore: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/crm/lead/restore/${id}`, params)
      .then((result) => result.data),

  updateStatus: async ({ id, params }: UpdatePayload) =>
    await api
      .patch(`${endpoint}/crm/lead/status/${id}`, params)
      .then((result) => result.data),

  convert: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/crm/lead/convert/${id}`, params)
      .then((result) => result.data),

  addHistory: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/crm/lead/history/${id}`, params)
      .then((result) => result.data),
};
