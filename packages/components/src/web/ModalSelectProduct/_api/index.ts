import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const ProductEndpoint = `${endpoint}/warehouse/product`;

const ProductApi = {
  getList: async (params: any) =>
    await api
      .get(`${ProductEndpoint}/condition`, params)
      .then((result) => result?.data),
};

export default ProductApi;
