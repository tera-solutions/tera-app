import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const CustomerEndpoint = `${endpoint}/sale/customer`;
const CustomerApi = {
  getList: async ({ params }) =>
    await api
      .get(`${CustomerEndpoint}/list`, params)
      .then((data) => data.data?.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${CustomerEndpoint}/detail/${id}`)
      .then((result) => result.data?.data),
};

export default CustomerApi;
