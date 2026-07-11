import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

/**
 * Ví số dư trả trước nội bộ (KHÔNG phải ví ngân hàng rút được).
 *
 * Khớp 1-1 với Postman `Modules` → `Finance/Wallet` (đối chiếu 2026-07-09) — **đúng 11 route,
 * không hơn**. Backend KHÔNG có `create`/`update`/`delete`/`export`, cũng không có resource
 * `fin/wallet-transaction/*` riêng: ví do backend tự tạo theo owner, mọi thay đổi số dư đi qua
 * các action ledger bên dưới và được ghi lại thành giao dịch bất biến (đọc qua `getTransactions`).
 *
 * ⚠️ Đừng thêm method mà không tra collection `Modules` trước (xem `docs/postman-structure.md` §5).
 */
export const WalletAPI = {
  // Query: business_id, owner_type (parent|customer|teacher), owner_id,
  // status (active|locked|closed), balance_from, balance_to, sort_by, sort_dir, per_page.
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/fin/wallet/list`, { ...params, ...params?.filters })
      .then((result) => result.data),

  // Trả về ví kèm 20 giao dịch gần nhất.
  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/fin/wallet/detail/${id}`)
      .then((result) => result.data),

  // Lịch sử giao dịch — query: wallet_id, transaction_type
  // (deposit|payment|refund|bonus|adjustment|expire), reference_type
  // (invoice|payment|refund|debt|enrollment|transaction), reference_id,
  // date_from, date_to (Y-m-d), sort_by, sort_dir, per_page (20|50|100).
  getTransactions: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/fin/wallet/transactions`, { ...params, ...params?.filters })
      .then((result) => result.data),

  // ===== Action ledger — mỗi call ghi 1 giao dịch bất biến =====

  // Body: { wallet_id, amount, payment_method, note }. amount > 0 (BR003).
  deposit: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/fin/wallet/deposit`, params)
      .then((result) => result.data),

  // Body: { wallet_id, amount, invoice_id, note } — số dư không được âm (BR006).
  payment: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/fin/wallet/payment`, params)
      .then((result) => result.data),

  // Body: { wallet_id, amount, reference_transaction_id, note } — không vượt số đã trả (BR009).
  refund: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/fin/wallet/refund`, params)
      .then((result) => result.data),

  // Body: { wallet_id, adjustment_type: increase|decrease, amount, reason } — reason bắt buộc (BR010).
  adjustment: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/fin/wallet/adjustment`, params)
      .then((result) => result.data),

  // Body: { wallet_id, invoice_id, amount, note } — trừ ví theo hóa đơn, link giao dịch với nó.
  fromInvoice: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/fin/wallet/from-invoice`, params)
      .then((result) => result.data),

  // Body: { wallet_id, payment_id, amount, note } — cộng ví từ đơn thanh toán.
  fromPayment: async ({ params }: CreatePayload) =>
    await api
      .post(`${endpoint}/fin/wallet/from-payment`, params)
      .then((result) => result.data),

  // Ví bị khóa chặn deposit/payment/refund (BR012).
  lock: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/fin/wallet/lock/${id}`, params)
      .then((result) => result.data),

  unlock: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/fin/wallet/unlock/${id}`, params)
      .then((result) => result.data),
};
