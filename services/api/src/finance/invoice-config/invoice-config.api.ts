import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

export interface InvoiceConfigParams {
  auto_generate: boolean;
  billing_day: number;
  due_days: number;
}

/** Matches `InvoiceConfigController` (`lib/app/Modules/Finance/InvoiceConfig/Router/api.php`) —
 * a per-business singleton, not a CRUD list. */
export const InvoiceConfigAPI = {
  get: async () => await api.get(`${endpoint}/fin/invoice-config`).then((r) => r.data),

  update: async (params: InvoiceConfigParams) =>
    await api.put(`${endpoint}/fin/invoice-config`, params).then((r) => r.data),
};
