import { portalEndpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const AttachmentEndPoint = `${portalEndpoint}/attachment`;

const AttachmentApi = {
  getList: async ({ params }) =>
    await api
      .get(`${AttachmentEndPoint}/list`, params)
      .then((result) => result?.data?.data),

  update: async (params) =>
    await api
      .put(`${AttachmentEndPoint}/update`, params)
      .then((result) => result?.data),
};

export default AttachmentApi;
