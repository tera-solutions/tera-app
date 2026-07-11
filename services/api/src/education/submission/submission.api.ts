import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { DetailPayload, ListPayload, UpdatePayload } from "@tera/api/_interface";

export interface SubmissionListPayload extends ListPayload {
  assignmentId: string | number;
}

export const SubmissionAPI = {
  getSubmitted: async ({ assignmentId, params }: SubmissionListPayload) =>
    await api
      .get(`${endpoint}/edu/submission/submitted/${assignmentId}`, {
        ...params,
        ...params?.filters,
      })
      .then((r) => r.data),

  getGraded: async ({ assignmentId, params }: SubmissionListPayload) =>
    await api
      .get(`${endpoint}/edu/submission/graded/${assignmentId}`, {
        ...params,
        ...params?.filters,
      })
      .then((r) => r.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/submission/detail/${id}`)
      .then((r) => r.data),

  grade: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/submission/grade/${id}`, params)
      .then((r) => r.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/submission/update/${id}`, params)
      .then((r) => r.data),

  publish: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/submission/publish/${id}`)
      .then((r) => r.data),
};
