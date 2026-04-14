import { endpointPortal } from '@tera/commons/constants/common';
import api from '@services/@tera/api/drivers';

export const BusinessAPI = {
  getBusiness: async () =>
    await api
      .get(`${endpointPortal}/business/get-info`)
      .then((result) => result.data?.data),
  updateBusiness: async ({ params }: any) =>
    await api
      .put(`${endpointPortal}/business/save`, params)
      .then((result) => result.data),
  registerBusiness: async ({ params }: any) =>
    await api
      .put(`${endpointPortal}/business/register`, params)
      .then((result) => result.data),
};
