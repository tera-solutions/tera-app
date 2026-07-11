import type { TransactionDirection } from "./_interface";

/**
 * Enum `transaction_type` thật của `fin/wallet/transactions` (Postman, 2026-07-09):
 * `deposit | payment | refund | bonus | adjustment | expire`. **Không có `withdraw`** —
 * đây là ví số dư trả trước, không rút về ngân hàng.
 *
 * `direction` bỏ trống = suy ra từ dấu của `amount` (dùng cho `adjustment`, vốn có thể
 * tăng hoặc giảm số dư tùy `adjustment_type`).
 *
 * ⚠️ Các key legacy (`topup`/`withdraw`/...) giữ lại phòng backend trả alias khác doc.
 * Giá trị lạ sẽ render badge xám với text thô — thấy badge xám khi chạy thật thì bổ sung.
 */
export const TYPE_CONFIG: Record<
  string,
  { label: string; className: string; direction?: TransactionDirection }
> = {
  // Enum thật
  deposit: { label: "Nạp tiền", className: "bg-emerald-50 text-emerald-600", direction: "in" },
  bonus: { label: "Thưởng", className: "bg-sky-50 text-sky-600", direction: "in" },
  refund: { label: "Hoàn tiền", className: "bg-violet-50 text-violet-600", direction: "in" },
  payment: { label: "Thanh toán", className: "bg-amber-50 text-amber-600", direction: "out" },
  expire: { label: "Hết hạn", className: "bg-slate-100 text-slate-500", direction: "out" },
  adjustment: { label: "Điều chỉnh", className: "bg-indigo-50 text-indigo-600" },

  // Legacy alias — chưa thấy trong doc route sống, giữ để phòng thủ.
  topup: { label: "Nạp tiền", className: "bg-emerald-50 text-emerald-600", direction: "in" },
  receive: { label: "Nhận tiền", className: "bg-sky-50 text-sky-600", direction: "in" },
  withdraw: { label: "Rút tiền", className: "bg-rose-50 text-rose-500", direction: "out" },
  deduction: { label: "Khấu trừ", className: "bg-amber-50 text-amber-600", direction: "out" },
};

/**
 * ⚠️ Giao dịch ví **không có field `status`** — sổ cái bất biến, mỗi bút toán ghi xong là
 * hoàn tất (`active/locked/closed` là trạng thái của *ví*, không phải của *giao dịch*).
 * `toTransaction` mặc định gán `completed`. Map này giữ lại phòng backend bổ sung sau.
 */
export const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  success: { label: "Thành công", className: "bg-emerald-50 text-emerald-600" },
  completed: { label: "Thành công", className: "bg-emerald-50 text-emerald-600" },
  pending: { label: "Đang xử lý", className: "bg-amber-50 text-amber-600" },
  processing: { label: "Đang xử lý", className: "bg-amber-50 text-amber-600" },
  failed: { label: "Thất bại", className: "bg-rose-50 text-rose-500" },
  cancelled: { label: "Đã hủy", className: "bg-slate-100 text-slate-500" },
};

export const SUCCESS_STATUSES = ["success", "completed"];
export const FAILED_STATUSES = ["failed", "cancelled"];

/** Trạng thái mặc định khi backend không trả `status` (xem chú thích STATUS_CONFIG). */
export const DEFAULT_TRANSACTION_STATUS = "completed";

// "Tất cả giao dịch" không nằm trong menu — là placeholder + nút × (allowClear).
// Giá trị gửi thẳng lên query `transaction_type` nên PHẢI khớp enum backend.
export const TYPE_FILTER_OPTIONS = [
  { value: "deposit", label: "Nạp tiền" },
  { value: "payment", label: "Thanh toán" },
  { value: "refund", label: "Hoàn tiền" },
  { value: "bonus", label: "Thưởng" },
  { value: "adjustment", label: "Điều chỉnh" },
  { value: "expire", label: "Hết hạn" },
];
