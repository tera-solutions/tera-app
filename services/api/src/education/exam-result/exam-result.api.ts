import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { DetailPayload, UpdatePayload } from "@tera/api/_interface";

export const ExamResultAPI = {
  grade: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/exam-result/grade/${id}`, params)
      .then((r) => r.data),

  publish: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/exam-result/publish/${id}`)
      .then((r) => r.data),
};
