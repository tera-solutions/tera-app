import { endpointPortal } from '@tera/common/constants/common';
import api from '@services/drivers';

export const UserAPI = {
  getProfile: async () =>
    await api
      .get(`${endpointPortal}/user/get-profile`)
      .then((result) => result.data),
  checkConnect: async () =>
    await api
      .get(`${endpointPortal}/connect`, {}, { timeout: 15000 })
      .then((result) => result.data?.data),
  updateProfile: async ({ params }: any) =>
    await api
      .put(`${endpointPortal}/user/update-profile`, params)
      .then((result) => result.data),
  updateAvatar: async ({ params }: any) =>
    await api
      .put(`${endpointPortal}/user/update-avatar`, params)
      .then((result) => result.data),
  changePassword: async ({ params }: any) =>
    await api
      .put(`${endpointPortal}/user/change-password`, params)
      .then((result) => result.data),
  changeSetting: async ({ params }: any) =>
    await api
      .post(`${endpointPortal}/user/change-setting`, params)
      .then((result) => result.data),
};
