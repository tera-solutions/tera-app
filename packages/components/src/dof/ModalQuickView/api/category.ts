import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const CategoryEndpoint = `${endpoint}/warehouse/category`;

const CategoryApi = {
  getList: async (params?: any) =>
    await api
      .get(`${CategoryEndpoint}/list`, params)
      .then((result) => result?.data?.data),
  getDetail: async (id: number, params?) =>
    await api
      .get(`${CategoryEndpoint}/detail/${id}`, params)
      .then((result) => result?.data?.data),
  create: async (params) =>
    await api
      .post(`${CategoryEndpoint}`, params)
      .then((result) => result?.data),
  update: async (id: number, params) =>
    await api
      .put(`${CategoryEndpoint}/${id}`, params)
      .then((result) => result?.data),
  delete: async (id: number) =>
    await api
      .delete(`${CategoryEndpoint}/${id}`)
      .then((result) => result?.data),
  import: async (id: number[]) =>
    await api
      .post(`${CategoryEndpoint}/import-data`, id)
      .then((result) => result?.data),
};

export default CategoryApi;
