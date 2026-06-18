
import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const TeacherAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/hr/teacher/list`, {...params, ...params?.filters})
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/hr/teacher/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/hr/teacher/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/hr/teacher/update/${id}`, params)
      .then((result) => result.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/hr/teacher/delete/${id}`)
      .then((result) => result.data),
  
  export: async ({ params }: ExportPayload) =>
    await api
      .post(`${endpoint}/hr/teacher/export`, params)
      .then((result) => result.data),

  suspend: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/hr/teacher/suspend/${id}`, params)
      .then((result) => result.data),

  restore: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/hr/teacher/restore/${id}`, params)
      .then((result) => result.data),

  resign: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/hr/teacher/resign/${id}`, params)
      .then((result) => result.data),

  getCertificateList: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/hr/teacher/certificate/list/${id}`)
      .then((result) => result.data),

  createCertificate: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/hr/teacher/certificate/create/${id}`, params)
      .then((result) => result.data),

  updateCertificate: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/hr/teacher/certificate/update/${id}`, params)
      .then((result) => result.data),

  deleteCertificate: async ({ id }: DeletePayload) =>
    await api
      .delete(`${endpoint}/hr/teacher/certificate/delete/${id}`)
      .then((result) => result.data),
};
