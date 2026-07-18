import axios from "axios";
import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { rootStore } from "@tera/stores";
import {
  CreatePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

type ReasonPayload = { id: number | string; params: { reason: string; note?: string } };
type PaymentPayload = {
  id: number | string;
  params: { amount: number; method: string; transaction_id?: string; note?: string; paid_at?: string };
};

/**
 * Khớp `InvoiceController` (`lib/app/Modules/Finance/Invoice/Router/api.php`) — đúng
 * 10 route: list/detail/download/create/update/approve/deny/cancel/refund/payment.
 * Backend KHÔNG có delete/export CSV cho hóa đơn (sổ sách tài chính không xóa được,
 * chỉ hủy) — `download` chỉ trả PDF của 1 hóa đơn.
 */
export const InvoiceAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/fin/invoice/list`, {...params, ...params?.filters})
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/fin/invoice/detail/${id}`)
      .then((result) => result.data),

  // Trả file nhị phân (PDF), không đi qua `api` driver dùng chung vì driver đó
  // giả định mọi response là JSON envelope {code, msg, data} (xem _interceptor).
  downloadPdf: async (id: number | string): Promise<Blob> => {
    const { token, device, business_id } = rootStore.globalStore;
    const response = await axios.get(`${endpoint}/fin/invoice/download/${id}`, {
      responseType: "blob",
      headers: {
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(device ? { "device-code": device } : {}),
        ...(business_id ? { "business-id": business_id } : {}),
      },
    });
    return response.data;
  },

  create: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/fin/invoice/create`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(`${endpoint}/fin/invoice/update/${id}`, params)
      .then((result) => result.data),

  // Chỉ áp dụng cho hóa đơn chi (payable) ở trạng thái draft/pending/pending_payment.
  approve: async ({ id }: DetailPayload) =>
    await api
      .post(`${endpoint}/fin/invoice/approve/${id}`, {})
      .then((result) => result.data),

  deny: async ({ id, params }: ReasonPayload) =>
    await api
      .post(`${endpoint}/fin/invoice/deny/${id}`, params)
      .then((result) => result.data),

  cancel: async ({ id, params }: ReasonPayload) =>
    await api
      .post(`${endpoint}/fin/invoice/cancel/${id}`, params)
      .then((result) => result.data),

  // Chỉ áp dụng cho hóa đơn đã ở trạng thái paid.
  refund: async ({ id, params }: ReasonPayload) =>
    await api
      .post(`${endpoint}/fin/invoice/refund/${id}`, params)
      .then((result) => result.data),

  pay: async ({ id, params }: PaymentPayload) =>
    await api
      .post(`${endpoint}/fin/invoice/payment/${id}`, params)
      .then((result) => result.data),
};
