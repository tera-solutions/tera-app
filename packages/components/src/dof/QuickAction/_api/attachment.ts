import { portalEndpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

const AttachmentEndPoint = `${portalEndpoint}/attachment`;

const AttachmentApi = {
  getList: async ({ params }) =>
    await api
      .get(`${AttachmentEndPoint}/list`, params)
      .then((result) => result?.data?.data),
  delete: async (id) =>
    await api
      .delete(`${AttachmentEndPoint}/delete/${id}`)
      .then((result) => result?.data),
};

export default AttachmentApi;
