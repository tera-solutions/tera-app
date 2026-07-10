import { toTransaction } from "../Wallet/_utils";
import {
  DEPOSIT_METHODS,
  MAX_AMOUNT,
  MIN_AMOUNT,
  TRANSACTION_FEE,
} from "./constants";
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

export const isSubmittable = (amount: number | null, methodKey: string) =>
  amount !== null && !validateAmount(amount) && !!methodKey;

export const buildDepositNote = (methodKey: string) => {
  const method = DEPOSIT_METHODS.find((m) => m.key === methodKey);
  return `Nạp tiền qua ${method?.name ?? "cổng thanh toán"}`;
};

export const methodFromDescription = (description: string): string | null => {
  const found = DEPOSIT_METHODS.find((m) =>
    description.toLowerCase().includes(m.name.toLowerCase()),
  );
  return found?.key ?? null;
};

/** Giao dịch ví → dòng bảng "Lịch sử nạp tiền". */
export const toDepositHistory = (raw: any): DepositHistoryRow[] =>
  (raw?.data?.items ?? []).map((item: any) => {
    const txn = toTransaction(item);
    return {
      id: txn.id,
      code: txn.code,
      createdAt: txn.createdAt,
      methodKey: methodFromDescription(txn.description),
      amount: txn.amount,
      fee: TRANSACTION_FEE,
      received: txn.amount - TRANSACTION_FEE,
      status: txn.status,
    };
  });
