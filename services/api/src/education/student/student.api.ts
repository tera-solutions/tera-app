import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const StudentAPI = {
  getList: async ({ params }: ListPayload) => {
      console.log("======= getList =====")

    const res = await api
      .get(`${endpoint}/edu/student/list`, params)
      .then((result) => result.data);
    console.log("res", res);
    return res;
  },

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/student/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/edu/student/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/student/update/${id}`, params)
      .then((result) => result.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/edu/student/delete/${id}`)
      .then((result) => result.data),
};
