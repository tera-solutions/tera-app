
import { endpoint } from "~/_endpoint";
import api from "~/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "~/_interface";

export const StudentProgressReportAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/report/student-progress-report/list`, params)
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/report/student-progress-report/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/report/student-progress-report/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/report/student-progress-report/update/${id}`, params)
      .then((result) => result.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/report/student-progress-report/delete/${id}`)
      .then((result) => result.data),
};
