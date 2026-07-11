import { MAX_AMOUNT, MIN_AMOUNT } from "./constants";

/** "1000000" → "1,000,000". */
export const formatAmountInput = (value: number | null) =>
  value === null ? "" : value.toLocaleString("en-US");

/** Chỉ giữ chữ số. Rỗng → `null` (khác 0, để chưa nhập thì chưa báo lỗi). */
export const parseAmountInput = (raw: string): number | null => {
  const digits = raw.replace(/\D/g, "");
  return digits ? Number(digits) : null;
};

/**
 * Lỗi hạn mức, hoặc `null` nếu hợp lệ. `null` amount = chưa nhập → chưa báo lỗi.
 *
 * ⚠️ Khác [051]: rút tiền còn bị chặn bởi **số dư khả dụng**. Kiểm cả 3 mốc theo thứ tự
 * min → max → số dư, để thông báo lỗi luôn là cái sát nhất với thứ người dùng vừa gõ.
 */
export const validateAmount = (
  amount: number | null,
  balance: number,
): string | null => {
  if (amount === null) return null;
  if (amount < MIN_AMOUNT)
    return `Số tiền tối thiểu là ${MIN_AMOUNT.toLocaleString("en-US")}đ`;
  if (amount > MAX_AMOUNT)
    return `Số tiền tối đa là ${MAX_AMOUNT.toLocaleString("en-US")}đ`;
  if (amount > balance) return "Số tiền rút vượt quá số dư khả dụng";
  return null;
};

/** Bấm được nút "Rút tiền" chưa: có số tiền hợp lệ + đã chọn tài khoản nhận. */
export const isSubmittable = (
  amount: number | null,
  balance: number,
  bankAccountId: string,
) => amount !== null && !validateAmount(amount, balance) && !!bankAccountId;
