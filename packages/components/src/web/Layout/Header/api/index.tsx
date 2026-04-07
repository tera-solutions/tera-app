import { portalEndpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const UserEndpoint = `${portalEndpoint}/user`;
export const UserApi = {
  getProfile: async () =>
    await api
      .get(`${UserEndpoint}/get-profile`)
      .then((result) => result.data?.data),
  update: async (params: any) =>
    await api
      .put(`${UserEndpoint}/update-profile`, params)
      .then((result) => result.data),
  changePassword: async (params: any) =>
    await api
      .put(`${UserEndpoint}/change-password`, params)
      .then((result) => result.data?.data),
};
