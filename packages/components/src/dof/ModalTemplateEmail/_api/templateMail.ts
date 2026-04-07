import { adminEndpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const TemplateMailEndpoint = `${adminEndpoint}/administrator/mail-template`;
const TemplateMailApi = {
  download: async ({ params }) =>
    await api
      .post(`${TemplateMailEndpoint}/download`, params)
      .then((result) => result?.data),
};
export default TemplateMailApi;
