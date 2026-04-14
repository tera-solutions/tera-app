import { adminEndpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

const adminUrl = `${adminEndpoint}/administrator`;

export const AdminApi = {
  getBusiness: async (id: string) =>
    await api
      .get(`${adminUrl}/business/detail/${id}`)
      .then((result) => result.data),
  getModuleActive: async ({ params }: any) =>
    await api
      .get(`${adminUrl}/business/group-role/list-module`, params)
      .then((result) => result.data?.data),
};
