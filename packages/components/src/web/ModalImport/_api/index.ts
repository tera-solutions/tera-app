import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const ImportExportEndpoint = `${endpoint}/operation/import-export`;

const ImportExportApi = {
  getTemplate: async ({ params }) =>
    await api
      .get(`${ImportExportEndpoint}/download-template-sample`, params)
      .then((res) => res?.data),
};

export default ImportExportApi;
