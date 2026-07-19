import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

export const CertificateAPI = {
  eligibility: async (classId: number | string) =>
    await api.get(`${endpoint}/edu/certificate/${classId}/eligibility`).then((r) => r.data),

  list: async (classId: number | string) =>
    await api.get(`${endpoint}/edu/certificate/${classId}/list`).then((r) => r.data),

  issue: async (classId: number | string, studentId: number | string) =>
    await api
      .post(`${endpoint}/edu/certificate/${classId}/issue`, { student_id: studentId })
      .then((r) => r.data),

  revoke: async (id: number | string, reason?: string) =>
    await api
      .post(`${endpoint}/edu/certificate/revoke/${id}`, { reason })
      .then((r) => r.data),

  /** Public — no auth token required, used by the QR verification page. */
  verify: async (token: string) =>
    await api.get(`${endpoint}/edu/certificate/verify/${token}`).then((r) => r.data),
};
