import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

/**
 * The business's own bank accounts for receiving tuition payments (used to
 * render the VietQR payment code) — distinct from `BankAccountAPI`
 * (`/bank-account/me`), which is a teacher's own payout account.
 * Matches `BusinessBankAccountController`
 * (`lib/app/Modules/Finance/BusinessBankAccount/Router/api.php`).
 */
export const BusinessBankAccountAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/fin/business-bank-account/list`, { ...params, ...params?.filters })
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/fin/business-bank-account/detail/${id}`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/fin/business-bank-account/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/fin/business-bank-account/update/${id}`, params)
      .then((result) => result.data),

  suspend: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/fin/business-bank-account/suspend/${id}`)
      .then((result) => result.data),

  restore: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/fin/business-bank-account/restore/${id}`)
      .then((result) => result.data),
};
