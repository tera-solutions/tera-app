import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { DetailPayload, ListPayload } from "@tera/api/_interface";

export interface CreateWalletRequestPayload {
  params: {
    request_type: "deposit" | "withdraw";
    amount: number;
    note?: string;
  };
}

type ReasonPayload = { id: number | string; params: { reject_reason: string } };
type CompletePayload = { id: number | string; params?: { note?: string } };

/**
 * Khớp `WalletRequestController` (`v1/fin/wallet-request/*`) — không có cổng thanh
 * toán: giáo viên gửi yêu cầu nạp/rút → admin duyệt → admin tự chuyển khoản ngoài
 * hệ thống → admin đánh dấu hoàn tất (lúc đó mới ghi vào sổ ví qua `fin/wallet/*`).
 */
export const WalletRequestAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/fin/wallet-request/list`, { ...params, ...params?.filters })
      .then((r) => r.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/fin/wallet-request/detail/${id}`)
      .then((r) => r.data),

  create: async ({ params }: CreateWalletRequestPayload) =>
    await api
      .post(`${endpoint}/fin/wallet-request/create`, params)
      .then((r) => r.data),

  cancel: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/fin/wallet-request/cancel/${id}`, {})
      .then((r) => r.data),

  // Admin-only (permission wallet_request.approve) — không được cấp cho Teacher.
  approve: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/fin/wallet-request/approve/${id}`, {})
      .then((r) => r.data),

  reject: async ({ id, params }: ReasonPayload) =>
    await api
      .post(`${endpoint}/fin/wallet-request/reject/${id}`, params)
      .then((r) => r.data),

  complete: async ({ id, params }: CompletePayload) =>
    await api
      .post(`${endpoint}/fin/wallet-request/complete/${id}`, params ?? {})
      .then((r) => r.data),
};
