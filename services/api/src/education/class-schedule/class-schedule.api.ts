import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const ClassScheduleAPI = {
  // List + Create lồng theo lớp: /edu/class-room/:classId/schedule/*
  getList: async ({ params }: ListPayload) => {
    const { class_id, ...rest } = params ?? {};
    return await api
      .get(`${endpoint}/edu/class-room/${class_id}/schedule/list`, rest)
      .then((r) => r.data);
  },

  create: async ({ params }: CreatePayload) => {
    const { class_id, ...rest } = params ?? {};
    return await api
      .post(`${endpoint}/edu/class-room/${class_id}/schedule/create`, rest)
      .then((r) => r.data);
  },

  // Detail + Update + Delete phẳng: /edu/class-schedule/*
  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/class-schedule/detail/${id}`)
      .then((r) => r.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/class-schedule/update/${id}`, params)
      .then((r) => r.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/edu/class-schedule/delete/${id}`)
      .then((r) => r.data),
};
