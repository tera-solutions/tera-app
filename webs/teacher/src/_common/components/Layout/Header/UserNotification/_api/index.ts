import { portalEndpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

const NotificationEndpoint = `${portalEndpoint}/notification`;
const NotificationApi = {
  getList: async (param?) =>
    await api
      .get(`${NotificationEndpoint}/list`, param)
      .then((result) => result?.data?.data),
  read: async (id) =>
    await api
      .get(`${NotificationEndpoint}/read-notification/${id}`)
      .then((result) => result?.data),
  create: async (params) =>
    await api
      .post(`${NotificationEndpoint}`, params)
      .then((result) => result?.data),
  update: async (id, params) =>
    await api
      .put(`${NotificationEndpoint}/${id}`, params)
      .then((result) => result?.data?.data),
  delete: async (id) =>
    await api
      .delete(`${NotificationEndpoint}/delete/${id}`)
      .then((result) => result?.data),
};

export default NotificationApi;
