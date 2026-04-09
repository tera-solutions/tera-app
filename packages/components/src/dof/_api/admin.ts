import { adminEndpoint } from "@tera/api/_endpoint";
import { parserParamsArray } from "@tera/commons/utils/utils";
import api from "@tera/api/drivers";

const AdministratorEndpoint = `${adminEndpoint}/administrator`;

const AdministratorApi = {
  getListModule: async (param?) =>
    await api
      .get(`${AdministratorEndpoint}/module/list`, param)
      .then((result) => result?.data?.data),
  getListUser: async (param?) =>
    await api
      .get(`${AdministratorEndpoint}/user/list`, param)
      .then((result) => result?.data?.data),
  getListPageConfig: async (param?) =>
    await api
      .get(`${AdministratorEndpoint}/page/list`, param)
      .then((result) => result?.data?.data),
  getListTableConfig: async (param?) =>
    await api
      .get(`${AdministratorEndpoint}/page-table/list`, param)
      .then((result) => result?.data?.data),
  getListFormConfig: async (param?) =>
    await api
      .get(`${AdministratorEndpoint}/form-data/list`, param)
      .then((result) => result?.data?.data),
  getListFieldConfig: async (param?) =>
    await api
      .get(`${AdministratorEndpoint}/form-field/list`, parserParamsArray(param))
      .then((result) => result?.data?.data),
  getListControlConfig: async (param?) =>
    await api
      .get(`${AdministratorEndpoint}/page-control/list`, param)
      .then((result) => result?.data?.data),
  getListColumnConfig: async (param?) =>
    await api
      .get(
        `${AdministratorEndpoint}/page-table-column/list`,
        parserParamsArray(param),
      )
      .then((result) => result?.data?.data),
  getListIcon: async (param?) =>
    await api
      .get(`${AdministratorEndpoint}/icon/list`, param)
      .then((result) => result?.data),
  getListObjectType: async (params?) =>
    await api
      .get(`${AdministratorEndpoint}/object-type/list`, params)
      .then((result) => result?.data?.data),
  getListStatusType: async (params?) =>
    await api
      .get(`${AdministratorEndpoint}/object-status/list`, params)
      .then((result) => result?.data?.data),
  getListDataType: async (params?) =>
    await api
      .get(`${AdministratorEndpoint}/data-type/list`, params)
      .then((result) => result?.data?.data),
  getListDataStatus: async (params?) =>
    await api
      .get(`${AdministratorEndpoint}/data-status/list`, params)
      .then((result) => result?.data?.data),
  getListRole: async (params?) =>
    await api
      .get(`${AdministratorEndpoint}/role/list`, params)
      .then((result) => result?.data?.data),
  getListEmailConfig: async (params?) =>
    await api
      .get(`${AdministratorEndpoint}/mail-config/list`, params)
      .then((result) => result?.data?.data),
  getListTemplateEmail: async ({ params }) =>
    await api
      .get(`${AdministratorEndpoint}/mail-template/list`, params)
      .then((result) => result?.data?.data),
  getListSelectPrintTemplate: async ({ params }) =>
    await api
      .get(`${AdministratorEndpoint}/print-template/list`, params)
      .then((result) => result?.data?.data),
  getTemplateEmailDetail: async (id?) =>
    await api
      .get(`${AdministratorEndpoint}/mail-template/detail/${id}`)
      .then((result) => result?.data?.data),
  getMailConfigList: async ({ params }) =>
    await api
      .get(`${AdministratorEndpoint}/mail-config/list`, params)
      .then((data) => data?.data?.data),
  getListMenu: async (param?) =>
    await api
      .get(`${AdministratorEndpoint}/page-menu/list`, param)
      .then((result) => result?.data?.data),
  getListEpic: async (param?) =>
    await api
      .get(`${AdministratorEndpoint}/epic/list`, param)
      .then((result) => result?.data?.data),
  getListPage: async (param?) =>
    await api
      .get(`${AdministratorEndpoint}/page/list`, param)
      .then((result) => result?.data?.data),
  getTableConfig: async (param?) =>
    await api
      .get(`${AdministratorEndpoint}/page-table/get-config`, param)
      .then((result) => result?.data?.data),
  getListBusiness: async (params?) =>
    await api
      .get(`${AdministratorEndpoint}/business/list`, params)
      .then((result) => result?.data?.data),
  getListBank: async (params?) =>
    await api
      .get(`${AdministratorEndpoint}/payment-method/bank`, params)
      .then((result) => result?.data?.data),
};

export default AdministratorApi;
