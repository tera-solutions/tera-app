import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const SupplierEndpoint = `${endpoint}/purchase/supplier`;

const SupplierApi = {
  getList: async (params) =>
    await api
      .get(`${SupplierEndpoint}/list`, params)
      .then((result) => result?.data?.data),
};

export default SupplierApi;
