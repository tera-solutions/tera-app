import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export interface PlacementTestResultsPayload {
  id: number | string;
  params?: Record<string, unknown>;
}

export interface RecordPlacementTestResultPayload {
  id: number | string;
  params: Record<string, unknown>;
}

export const PlacementTestAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/placement-test/list`, { ...params, ...params?.filters })
      .then((r) => r.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/placement-test/detail/${id}`)
      .then((r) => r.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/edu/placement-test/create`, params)
      .then((r) => r.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/placement-test/update/${id}`, params)
      .then((r) => r.data),

  publish: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/placement-test/publish/${id}`, {})
      .then((r) => r.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/edu/placement-test/delete/${id}`)
      .then((r) => r.data),

  getResults: async ({ id, params }: PlacementTestResultsPayload) =>
    await api
      .get(`${endpoint}/edu/placement-test/results/${id}`, params)
      .then((r) => r.data),

  recordResult: async ({ id, params }: RecordPlacementTestResultPayload) =>
    await api
      .post(`${endpoint}/edu/placement-test/results/${id}`, params)
      .then((r) => r.data),
};
