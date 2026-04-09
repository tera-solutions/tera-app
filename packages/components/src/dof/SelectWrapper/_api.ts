import { adminEndpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { filterField } from "@tera/commons/utils";

const SelectWrapperEndpoint = `${adminEndpoint}/administrator/page-api`;

const SelectWrapperApi = {
  getDataSource: async (param?) =>
    await api
      .get(`${SelectWrapperEndpoint}/list`, filterField(param))
      .then((result) => result?.data),
  getListDataSource: async (url, param?) =>
    await api
      .get(`${adminEndpoint}${url}`, filterField(param))
      .then((result) => result?.data),
  getListTest: async (type, param?) =>
    await api
      .get(`${adminEndpoint}/hrm/${type}/list`, filterField(param))
      .then((result) => result?.data),
};

export default SelectWrapperApi;
