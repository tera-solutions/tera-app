import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

const CallEndpoint = `${endpoint}/customer-service/call`;

const CallApi = {
  getList: async (params) =>
    await api
      .get(`${CallEndpoint}/list`, params)
      .then((result) => result?.data?.data),
  getDetail: async (id) =>
    await api
      .get(`${CallEndpoint}/detail/${id}`)
      .then((result) => result?.data?.data),
};

export default CallApi;
