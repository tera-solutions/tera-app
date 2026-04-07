import { endpointPortal } from '@tera/commons/constants/common';
import api from '@services/drivers';

export const SyncAPI = {
  pullChanges: async (params: any) =>
    await api
      .get(`${endpointPortal}/sync/pull-change`, params, { timeout: 30000 })
      .then((result) => result?.data?.data),
  pushChanges: async (params: any) =>
    await api
      .post(`${endpointPortal}/sync/push-change`, params, { timeout: 30000 })
      .then((result) => result?.data),
};
