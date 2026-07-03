import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

/**
 * Lead ↔ Student (học viên liên kết) — route backend lồng theo lead:
 *   GET    /crm/lead/:leadId/student/list
 *   POST   /crm/lead/:leadId/student/add
 *   PUT    /crm/lead/:leadId/student/update/:id
 *   DELETE /crm/lead/:leadId/student/delete/:id
 */
export interface LeadStudentListPayload {
  leadId: string | number;
  params?: Record<string, any>;
}

export interface LeadStudentCreatePayload {
  leadId: string | number;
  params: Record<string, any>;
}

export interface LeadStudentUpdatePayload {
  leadId: string | number;
  id: string | number;
  params: Record<string, any>;
}

export interface LeadStudentDeletePayload {
  leadId: string | number;
  id: string | number;
}

export const LeadStudentAPI = {
  getList: async ({ leadId, params }: LeadStudentListPayload) =>
    await api
      .get(`${endpoint}/crm/lead/${leadId}/student/list`, {
        ...params,
        ...params?.filters,
      })
      .then((result) => result.data),

  add: async ({ leadId, params }: LeadStudentCreatePayload) =>
    await api
      .post(`${endpoint}/crm/lead/${leadId}/student/add`, {
        lead_id: leadId,
        ...params,
      })
      .then((result) => result.data),

  update: async ({ leadId, id, params }: LeadStudentUpdatePayload) =>
    await api
      .put(`${endpoint}/crm/lead/${leadId}/student/update/${id}`, params)
      .then((result) => result.data),

  delete: async ({ leadId, id }: LeadStudentDeletePayload) =>
    await api
      .delete(`${endpoint}/crm/lead/${leadId}/student/delete/${id}`)
      .then((result) => result.data),
};
