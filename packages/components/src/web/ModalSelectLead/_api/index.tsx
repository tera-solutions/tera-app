import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const LeadManagementEndpoint = `${endpoint}/marketing/lead`;

const LeadManagementApi = {
  getList: async ({ params }) =>
    await api
      .get(`${LeadManagementEndpoint}/list`, params)
      .then((result) => result.data?.data),
};

export default LeadManagementApi;
