import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { ListPayload } from "@tera/api/_interface";

export interface UpgradeSubscriptionPayload {
  params: {
    package_id: number;
    payment_method?: string;
    billing_cycle?: string;
  };
}

export const SubscriptionAPI = {
  getCurrent: async () =>
    await api.get(`${endpoint}/sys/subscription/current`).then((r) => r.data),

  upgrade: async ({ params }: UpgradeSubscriptionPayload) =>
    await api
      .post(`${endpoint}/sys/subscription/upgrade`, params)
      .then((r) => r.data),

  getInvoiceList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/sys/subscription/invoice/list`, { ...params, ...params?.filters })
      .then((r) => r.data),
};
