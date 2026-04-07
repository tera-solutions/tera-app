import { endpointAuth } from '@tera/commons/constants/common';
import api from '@services/drivers';

export const AuthApi = {
  checkHealth: async () =>
    await api
      .get(`${endpointAuth}/health`, {}, { timeout: 30000 })
      .then((result) => result?.data?.data),
  getDeviceCode: async () =>
    await api
      .post(`${endpointAuth}/device/init`)
      .then((result) => result.data?.data),
  logout: async () => await api.post(`${endpointAuth}/logout`),
  login: async ({ params }: any) =>
    await api
      .post(`${endpointAuth}/login`, params, { timeout: 10000 })
      .then((result) => result.data),
  register: async ({ params }: any) =>
    await api
      .post(`${endpointAuth}/login`, params)
      .then((result) => result.data),
};
