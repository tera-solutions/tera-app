import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const ProgressReportAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/education/progress-report/list`, params)
      .then((r) => r.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/education/progress-report/detail/${id}`)
      .then((r) => r.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/education/progress-report/create`, params)
      .then((r) => r.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/education/progress-report/update/${id}`, params)
      .then((r) => r.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/education/progress-report/delete/${id}`)
      .then((r) => r.data),
};
