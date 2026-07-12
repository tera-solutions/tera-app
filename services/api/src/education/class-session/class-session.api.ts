import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const ClassSessionAPI = {
  // List + Create + Generate lồng theo lớp: /edu/class-room/:classId/session/*
  getList: async ({ params }: ListPayload) => {
    const { class_id, ...rest } = params ?? {};
    return await api
      .get(`${endpoint}/edu/class-room/${class_id}/session/list`, rest)
      .then((r) => r.data);
  },

  create: async ({ params }: CreatePayload) => {
    const { class_id, ...rest } = params ?? {};
    return await api
      .post(`${endpoint}/edu/class-room/${class_id}/session/create`, rest)
      .then((r) => r.data);
  },

  // Sinh buổi học tự động cho lớp
  generate: async ({ params }: CreatePayload) => {
    const { class_id, ...rest } = params ?? {};
    return await api
      .post(`${endpoint}/edu/class-room/${class_id}/session/generate`, rest)
      .then((r) => r.data);
  },

  // Detail + Update + Cancel + Delete phẳng: /edu/class-session/*
  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/class-session/detail/${id}`)
      .then((r) => r.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/class-session/update/${id}`, params)
      .then((r) => r.data),

  cancel: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/class-session/cancel/${id}`, params)
      .then((r) => r.data),

  start: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/class-session/start/${id}`, params)
      .then((r) => r.data),

  end: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/class-session/end/${id}`, params)
      .then((r) => r.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/edu/class-session/delete/${id}`)
      .then((r) => r.data),
};
