import { adminEndpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const PrintKeyEndpoint = `${adminEndpoint}/administrator/print-key`;

const PrintKeyApi = {
  getList: async (params?) =>
    await api
      .post(`${PrintKeyEndpoint}/list-key`, params)
      .then((result) => result?.data?.data),
};

export default PrintKeyApi;
