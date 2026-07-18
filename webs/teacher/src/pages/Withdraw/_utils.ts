import { MAX_AMOUNT, MIN_AMOUNT, TRANSACTION_FEE } from "./constants";
import type { WithdrawHistoryRow, WithdrawStats } from "./_interface";

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

/**
 * Bấm được nút "Rút tiền" chưa: số tiền hợp lệ + đã có tài khoản ngân hàng đã lưu
 * (`fin/bank-account/me`) — BE tự lấy tài khoản này khi rút, không nhận nhập tay nữa.
 */
export const isSubmittable = (
  amount: number | null,
  balance: number,
  hasBankAccount: boolean,
) => amount !== null && !validateAmount(amount, balance) && hasBankAccount;

/**
 * ✅ Khớp `WalletRequestResource` (`fin/wallet-request/list`) — tài khoản nhận tiền giờ
 * nằm lồng ở `bank_account` (trỏ tới `fin/bank-account/me`), không còn 3 field rời.
 */
export const toWithdrawHistory = (raw: any): WithdrawHistoryRow[] =>
  (raw?.data?.items ?? []).map((item: any) => {
    const amount = Number(item.amount ?? 0) || 0;
    const bank = item.bank_account ?? {};
    return {
      id: item.id,
      code: item.code,
      requestedAt: item.created_at ? new Date(String(item.created_at).replace(" ", "T")) : null,
      amount,
      fee: TRANSACTION_FEE,
      received: amount - TRANSACTION_FEE,
      bankName: bank.bank_name ?? "—",
      accountNumber: bank.bank_account_number ?? "",
      accountHolder: bank.bank_account_holder ?? "",
      status: item.status,
      rejectReason: item.reject_reason ?? null,
    };
  });

export const summarizeWithdraw = (rows: WithdrawHistoryRow[]): WithdrawStats => {
  const completed = rows.filter((r) => r.status === "completed");
  const pending = rows.filter((r) => r.status === "pending" || r.status === "approved");
  return {
    totalWithdrawn: completed.reduce((a, r) => a + r.amount, 0),
    totalWithdrawnCount: completed.length,
    pendingAmount: pending.reduce((a, r) => a + r.amount, 0),
    pendingCount: pending.length,
  };
};
