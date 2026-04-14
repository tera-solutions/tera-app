import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const CoursePricingAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/education/course-pricing/list`, params)
      .then((r) => r.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/education/course-pricing/detail/${id}`)
      .then((r) => r.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/education/course-pricing/create`, params)
      .then((r) => r.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/education/course-pricing/update/${id}`, params)
      .then((r) => r.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/education/course-pricing/delete/${id}`)
      .then((r) => r.data),
};
