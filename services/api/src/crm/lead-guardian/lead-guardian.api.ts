import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

/**
 * Lead ↔ Guardian (người giám hộ) — route backend lồng theo lead:
 *   GET    /crm/lead/:leadId/guardian/list
 *   POST   /crm/lead/:leadId/guardian/add
 *   PUT    /crm/lead/:leadId/guardian/update/:id
 *   DELETE /crm/lead/:leadId/guardian/delete/:id
 */
export interface LeadGuardianListPayload {
  leadId: string | number;
  params?: Record<string, any>;
}

export interface LeadGuardianCreatePayload {
  leadId: string | number;
  params: Record<string, any>;
}

export interface LeadGuardianUpdatePayload {
  leadId: string | number;
  id: string | number;
  params: Record<string, any>;
}

export interface LeadGuardianDeletePayload {
  leadId: string | number;
  id: string | number;
}

export const LeadGuardianAPI = {
  getList: async ({ leadId, params }: LeadGuardianListPayload) =>
    await api
      .get(`${endpoint}/crm/lead/${leadId}/guardian/list`, {
        ...params,
        ...params?.filters,
      })
      .then((result) => result.data),

  add: async ({ leadId, params }: LeadGuardianCreatePayload) =>
    await api
      .post(`${endpoint}/crm/lead/${leadId}/guardian/add`, {
        lead_id: leadId,
        ...params,
      })
      .then((result) => result.data),

  update: async ({ leadId, id, params }: LeadGuardianUpdatePayload) =>
    await api
      .put(`${endpoint}/crm/lead/${leadId}/guardian/update/${id}`, params)
      .then((result) => result.data),

  delete: async ({ leadId, id }: LeadGuardianDeletePayload) =>
    await api
      .delete(`${endpoint}/crm/lead/${leadId}/guardian/delete/${id}`)
      .then((result) => result.data),
};
