import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const CustomerEndpoint = `${endpoint}/sale/customer`;

const CustomerApi = {
  getList: async (params) =>
    await api
      .get(`${CustomerEndpoint}/list`, params)
      .then((result) => result?.data?.data),
  getDetail: async (id) =>
    await api
      .get(`${CustomerEndpoint}/detail/${id}`)
      .then((result) => result?.data?.data),
  create: async (params) =>
    await api
      .post(`${CustomerEndpoint}`, params)
      .then((result) => result?.data),
  update: async (id, params) =>
    await api
      .put(`${CustomerEndpoint}/${id}`, params)
      .then((result) => result?.data),
  changeStatus: async ({ params, query }) =>
    await api
      .put(
        `${CustomerEndpoint}/update/status?stock_id=${query?.stock_id}&location_id=${query?.location_id}`,
        params,
      )
      .then((result) => result?.data),
  delete: async (id) =>
    await api
      .delete(`${CustomerEndpoint}/${id}`)
      .then((result) => result?.data),
};

export default CustomerApi;
