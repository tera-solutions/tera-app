
import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const LevelAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/level/list`, { ...params, ...params?.filters })
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/level/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/edu/level/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/level/update/${id}`, params)
      .then((result) => result.data),

  // suspend/restore không body — chỉ nhận id
  suspend: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/level/suspend/${id}`)
      .then((result) => result.data),

  restore: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/level/restore/${id}`)
      .then((result) => result.data),
};
