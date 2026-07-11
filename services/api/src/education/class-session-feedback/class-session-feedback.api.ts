
import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { CreatePayload, ListPayload } from "@tera/api/_interface";

export const ClassSessionFeedbackAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/session-feedback/list`, {...params, ...params?.filters})
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/edu/session-feedback/create`, params)
      .then((result) => result.data),
};
