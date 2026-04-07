import { endpoint, portalEndpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const CrmApi = {
  getListLocationId: async (params?) =>
    await api
      .get(`${portalEndpoint}/business-location/list`, params)
      .then((res) => res?.data?.data),
  getStageList: async (params?) =>
    await api
      .get(`${endpoint}/marketing/campaign-step/list`, params)
      .then((res) => res?.data?.data),
  getStageGroupList: async (params?) =>
    await api
      .get(`${endpoint}/marketing/campaign-stage-group/list`, params)
      .then((res) => res?.data?.data),
  getProcessApprovalList: async (params?) =>
    await api
      .get(`${endpoint}/config-approve-stream/list`, params)
      .then((res) => res?.data?.data),
  getCampaignList: async ({ params }) =>
    await api
      .get(`${endpoint}/marketing/campaign/list`, params)
      .then((data) => data?.data?.data),
  getMemberList: async ({ params }) =>
    await api
      .get(`${endpoint}/marketing/campaign/list-members`, params)
      .then((data) => data?.data?.data),
  getStepList: async ({ params }) =>
    await api
      .get(`${endpoint}/marketing/campaign-step/list`, params)
      .then((data) => data?.data?.data),
  getCategoryList: async (params) =>
    await api
      .get(`${endpoint}/warehouse/category/list`, params)
      .then((result) => result?.data?.data),
  getContactList: async (params) =>
    await api
      .get(`${endpoint}/warehouse/customer/contact/list`, params)
      .then((result) => result?.data?.data),
  getEmployeeList: async ({ params }) =>
    await api
      .get(`${endpoint}/hrm/employee/list`, params)
      .then((result) => result.data?.data),
  getLeadList: async ({ params }) =>
    await api
      .get(`${endpoint}/marketing/lead/list`, params)
      .then((result) => result.data?.data),
  getUnitList: async (params?) =>
    await api
      .get(`${endpoint}/warehouse/unit/list`, params)
      .then((result) => result?.data?.data),
  getBrandList: async (params?) =>
    await api
      .get(`${endpoint}/warehouse/brand/list`, params)
      .then((result) => result?.data?.data),
  getWarrantyList: async (params?) =>
    await api
      .get(`${endpoint}/warehouse/warranty/list`, params)
      .then((result) => result?.data?.data),
};

export default CrmApi;
