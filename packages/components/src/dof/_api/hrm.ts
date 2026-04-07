import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const HrmEndpoint = `${endpoint}/hrm`;

const HrmApi = {
  getListEmployee: async (param?) =>
    await api
      .get(`${HrmEndpoint}/employee/list`, param)
      .then((result) => result?.data?.data),
  getListDepartment: async (param?) =>
    await api
      .get(`${HrmEndpoint}/department/list`, param)
      .then((result) => result?.data?.data),
  getListJobTitle: async (param?) =>
    await api
      .get(`${HrmEndpoint}/jobtitle/list`, param)
      .then((result) => result?.data?.data),
  getListPosition: async (param?) =>
    await api
      .get(`${HrmEndpoint}/position/list`, param)
      .then((result) => result?.data?.data),
  getListConfigLeave: async (param?) =>
    await api
      .get(`${HrmEndpoint}/config-leave/list`, param)
      .then((result) => result?.data?.data),
  getListEmployeeShift: async (param?) =>
    await api
      .get(`${HrmEndpoint}/employee-shift/list`, param)
      .then((result) => result?.data?.data),
  getListCity: async (param?) =>
    await api
      .get(`${HrmEndpoint}/city/list`, param)
      .then((result) => result?.data?.data),
  getListDistrict: async (id?, param?) =>
    await api
      .get(`${HrmEndpoint}/district/list`, { city_id: id, ...param })
      .then((result) => result?.data?.data),
  getListWard: async (id?, param?) =>
    await api
      .get(`${HrmEndpoint}/ward/list`, { district_id: id, ...param })
      .then((result) => result?.data?.data),
  getListSelectPrintType: async (param?) =>
    await api
      .get(`${HrmEndpoint}/print-type/list`, param)
      .then((result) => result?.data?.data),
  getListSelectTypeCategoryPrintKey: async (param?) =>
    await api
      .get(`${HrmEndpoint}/print-key/list-category-type`, param)
      .then((result) => result?.data?.data),
};

export default HrmApi;
