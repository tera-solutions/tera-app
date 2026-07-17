
import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const SettingAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/sys/setting/list`, {...params, ...params?.filters})
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/sys/setting/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/sys/setting/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/sys/setting/update/${id}`, params)
      .then((result) => result.data),

  /** Create-or-update by `key` — used by toggles/selects that don't know the row id. */
  upsert: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/sys/setting/upsert`, params)
      .then((result) => result.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/sys/setting/delete/${id}`)
      .then((result) => result.data),
};
