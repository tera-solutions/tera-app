import { adminEndpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const pageTableColumnEndpoint = `${adminEndpoint}/administrator/page-table-column`;
const SystemTableConfigEndpoint = `${adminEndpoint}/administrator/page-table`;

interface ParamType<T> {
  params?: T;
}

const PageTableColumnAPI = {
  getTableConfig: async (params: any) =>
    await api
      .get(`${SystemTableConfigEndpoint}/get-config`, params)
      .then((result) => result.data?.data),
  getList: async <T>({ params }: ParamType<T>) =>
    await api
      .get(`${pageTableColumnEndpoint}/list`, params)
      .then((result) => result.data?.data),
  update: async (id: string | number, param: any) =>
    await api
      .put(`${pageTableColumnEndpoint}/update/${id}`, param)
      .then((result) => result.data),
  hideColumn: async ({ id, params }) =>
    await api
      .put(`${pageTableColumnEndpoint}/change-show-hide/${id}`, params)
      .then((result) => result.data),

  sortColumn: async ({ params }) =>
    await api
      .put(`${pageTableColumnEndpoint}/sort`, params)
      .then((result) => result.data),
};

export default PageTableColumnAPI;
