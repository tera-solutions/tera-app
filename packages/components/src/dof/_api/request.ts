import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const RequestEndpoint = `${endpoint}/req`;

const RequestApi = {
  getListRequestGroup: async (params?) =>
    await api
      .get(`${RequestEndpoint}/group/list`, params)
      .then((res) => res?.data?.data),
};

export default RequestApi;
