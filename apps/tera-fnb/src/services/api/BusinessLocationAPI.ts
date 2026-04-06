import { endpointPortal } from '@constants/common';
import api from '@services/drivers';
import {
  createPayload,
  deletePayload,
  detailPayload,
  listPayload,
  updatePayload,
} from '../_interface';

export const BusinessLocationAPI = {
  getList: async ({ params }: listPayload) =>
    await api
      .get(`${endpointPortal}/business-location/list`, params)
      .then((result) => result.data?.data),
  getDetail: async ({ id }: detailPayload) =>
    await api
      .get(`${endpointPortal}/business-location/detail/${id}`)
      .then((result) => result.data?.data),
  pushChange: async ({ params }: createPayload) =>
    await api
      .post(`${endpointPortal}/business-location/push-changes`, params)
      .then((result) => result.data),
  create: async ({ params }: createPayload) =>
    await api
      .post(`${endpointPortal}/business-location/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }: updatePayload) =>
    await api
      .put(`${endpointPortal}/business-location/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }: deletePayload) =>
    await api
      .delete(`${endpointPortal}/business-location/delete/${id}`)
      .then((result) => result.data),
};
