import { endpointCRM } from '@tera/common/constants/common';
import api from '@services/drivers';
import {
  createPayload,
  deletePayload,
  detailPayload,
  listPayload,
  updatePayload,
} from '../_interface';

export const CustomerAPI = {
  getList: async ({ params }: listPayload) =>
    await api
      .get(`${endpointCRM}/sale/customer/list`, params)
      .then((result) => result.data?.data),
  getDetail: async ({ id }: detailPayload) =>
    await api
      .get(`${endpointCRM}/sale/customer/detail/${id}`)
      .then((result) => result.data?.data),
  create: async ({ params }: createPayload) =>
    await api
      .post(`${endpointCRM}/sale/customer/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }: updatePayload) =>
    await api
      .put(`${endpointCRM}/sale/customer/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }: deletePayload) =>
    await api
      .delete(`${endpointCRM}/sale/customer/delete/${id}`)
      .then((result) => result.data),
};
