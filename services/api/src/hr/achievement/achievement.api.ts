import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { CreatePayload, ListPayload } from "@tera/api/_interface";

export const AchievementAPI = {
  getSummary: async () =>
    await api.get(`${endpoint}/hr/achievement/summary`).then((r) => r.data),

  getProgress: async (period: "week" | "month" | "year" = "month") =>
    await api
      .get(`${endpoint}/hr/achievement/progress`, { period })
      .then((r) => r.data),
};

export const TeacherReviewAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/hr/teacher-review/list`, { ...params, ...params?.filters })
      .then((r) => r.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/hr/teacher-review/create`, params)
      .then((r) => r.data),
};
