import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const QuestionAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/question/list`, { ...params, ...params?.filters })
      .then((r) => r.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/question/detail/${id}`)
      .then((r) => r.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/edu/question/create`, params)
      .then((r) => r.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/question/update/${id}`, params)
      .then((r) => r.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/edu/question/delete/${id}`)
      .then((r) => r.data),

  clone: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/question/clone/${id}`, {})
      .then((r) => r.data),

  // Quy trình duyệt (question.md §IX): draft --review--> reviewing --approve--> approved
  // --activate--> active (chỉ ACTIVE mới được rút vào đề thi). archive nhận mọi trạng thái.
  review: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/question/review/${id}`, {})
      .then((r) => r.data),

  approve: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/question/approve/${id}`, {})
      .then((r) => r.data),

  activate: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/question/activate/${id}`, {})
      .then((r) => r.data),

  archive: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/edu/question/archive/${id}`, {})
      .then((r) => r.data),
};

/** `edu/question-category/*` — reuses `question.*` permission codes (BE convention). */
export const QuestionCategoryAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/question-category/list`, { ...params, ...params?.filters })
      .then((r) => r.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/edu/question-category/create`, params)
      .then((r) => r.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/question-category/update/${id}`, params)
      .then((r) => r.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/edu/question-category/delete/${id}`)
      .then((r) => r.data),
};

/** `edu/question-tag/*` — reuses `question.*` permission codes (BE convention). */
export const QuestionTagAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/edu/question-tag/list`, { ...params, ...params?.filters })
      .then((r) => r.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/edu/question-tag/create`, params)
      .then((r) => r.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/edu/question-tag/update/${id}`, params)
      .then((r) => r.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/edu/question-tag/delete/${id}`)
      .then((r) => r.data),
};
