import { DEPOSIT_METHODS, MAX_AMOUNT, MIN_AMOUNT } from "./constants";
import type { DepositHistoryRow } from "./_interface";

export const formatAmountInput = (value: number | null) =>
  value === null ? "" : value.toLocaleString("en-US");

export const parseAmountInput = (raw: string): number | null => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  return Number(digits);
};

export const validateAmount = (amount: number | null): string | null => {
  if (amount === null) return null;
  if (amount < MIN_AMOUNT)
    return `Số tiền tối thiểu là ${MIN_AMOUNT.toLocaleString("en-US")}đ`;
  if (amount > MAX_AMOUNT)
    return `Số tiền tối đa là ${MAX_AMOUNT.toLocaleString("en-US")}đ`;
  return null;
};

/**
 * Deposit has no bank-account requirement — that's only a withdraw payout
 * target (see `WalletRequestService::resolveBankAccountId`, backend only
 * gates `withdraw`).
 */
export const isSubmittable = (amount: number | null, methodKey: string) =>
  amount !== null && !validateAmount(amount) && !!methodKey;

/** BE `fin_wallet_requests` không có cột phương thức thanh toán — gấp tên phương
 * thức vào `note` để admin biết cách người dùng đã/định chuyển tiền. */
export const buildDepositNote = (methodKey: string) => {
  const method = DEPOSIT_METHODS.find((m) => m.key === methodKey);
  return `Nạp tiền qua ${method?.name ?? "cổng thanh toán"}`;
};

/** ✅ Khớp `WalletRequestResource` (`fin/wallet-request/list`). */
export const toDepositHistory = (raw: any): DepositHistoryRow[] =>
  (raw?.data?.items ?? []).map((item: any) => ({
    id: item.id,
    code: item.code,
    createdAt: item.created_at ? new Date(String(item.created_at).replace(" ", "T")) : null,
    amount: Number(item.amount ?? 0) || 0,
    note: item.note ?? null,
    status: item.status,
    rejectReason: item.reject_reason ?? null,
  }));
