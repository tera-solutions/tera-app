import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { DetailPayload, ListPayload } from "@tera/api/_interface";

export const ExamSessionAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/exam-session/list`, { ...params, ...params?.filters })
      .then((r) => r.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/exam-session/detail/${id}`)
      .then((r) => r.data),
};
