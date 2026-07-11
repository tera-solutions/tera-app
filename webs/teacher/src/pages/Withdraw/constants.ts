/**
 * 🚩 Bật luồng rút tiền thật.
 *
 * Đang `false` vì **backend không có khái niệm rút tiền**: `transaction_type` chỉ có
 * `deposit|payment|refund|bonus|adjustment|expire` (không có `withdraw`), và folder `Finance/Wallet`
 * không có route nào tạo/duyệt yêu cầu rút. Ví là **số dư trả trước để thanh toán hóa đơn**,
 * không rút về ngân hàng.
 *
 * ⚠️ Đây là ràng buộc **nghiệp vụ**, không phải thiếu quyền như [051]. Bật cờ này lên cũng không
 * có gì để gọi. Cần product chốt: BE làm module rút tiền + luồng duyệt, hay bỏ task khỏi sprint.
 * Xem `agents/claude/teacher/sprint4-wallet-checklist.md` §[052].
 */
export const WITHDRAW_ENABLED = false;

/** Hạn mức phía sản phẩm (lấy từ thiết kế `picture's page/rut tien.png`). */
export const MIN_AMOUNT = 50_000;
export const MAX_AMOUNT = 50_000_000;

/** ⚠️ BE không có bảng phí → "Miễn phí" là hiện trạng, không phải mock. */
export const TRANSACTION_FEE = 0;

/**
 * Trạng thái yêu cầu rút tiền theo thiết kế.
 * ⚠️ Chưa có nguồn dữ liệu — BE không có luồng duyệt. Giữ map để khi có API thì nối thẳng.
 */
export const WITHDRAW_STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  pending: { label: "Đang xử lý", className: "bg-amber-50 text-amber-600" },
  completed: { label: "Thành công", className: "bg-emerald-50 text-emerald-600" },
  rejected: { label: "Từ chối", className: "bg-rose-50 text-rose-500" },
  cancelled: { label: "Hủy", className: "bg-slate-100 text-slate-500" },
};

export const STATUS_FILTER_OPTIONS = [
  { value: "pending", label: "Đang xử lý" },
  { value: "completed", label: "Thành công" },
  { value: "rejected", label: "Từ chối" },
  { value: "cancelled", label: "Hủy" },
];
