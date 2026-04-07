import api from "@tera/states/drivers";
import { adminEndpoint } from "@tera/api/_endpoint";

const FormConfigEndpoint = `${adminEndpoint}/administrator/form-data`;

const FormConfigApi = {
  getConfig: async (params: any) =>
    await api
      .get(`${FormConfigEndpoint}/get-config`, params)
      .then((result) => result?.data?.data),
};

export default FormConfigApi;
