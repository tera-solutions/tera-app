import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export interface DiscountRulesPayload {
  id: number | string;
  params: {
    rules: {
      type: string;
      value: number;
      condition?: string;
      enabled?: boolean;
    }[];
  };
}

/**
 * Tuition subscription packages (theo buổi/tháng/kỳ/tùy chỉnh), applied when
 * enrolling a student — teacher-app-081/082. Matches
 * `SubscriptionPackageController`
 * (`lib/app/Modules/Finance/SubscriptionPackage/Router/api.php`).
 */
export const SubscriptionPackageAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/fin/subscription-package/list`, { ...params, ...params?.filters })
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/fin/subscription-package/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/fin/subscription-package/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/fin/subscription-package/update/${id}`, params)
      .then((result) => result.data),

  toggle: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/fin/subscription-package/toggle/${id}`)
      .then((result) => result.data),

  delete: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/fin/subscription-package/delete/${id}`)
      .then((result) => result.data),

  getUsages: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/fin/subscription-package/usages/${id}`)
      .then((result) => result.data),

  setDiscountRules: async ({ id, params }: DiscountRulesPayload) =>
    await api
      .put(`${endpoint}/fin/subscription-package/discount-rules/${id}`, params)
      .then((result) => result.data),
};
