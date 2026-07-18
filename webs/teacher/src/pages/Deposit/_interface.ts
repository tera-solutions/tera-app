export type WalletRequestStatus = "pending" | "approved" | "rejected" | "completed" | "cancelled";

/** Một dòng trong bảng "Lịch sử nạp tiền" — dựng từ `fin/wallet-request/list?request_type=deposit`. */
export interface DepositHistoryRow {
  id: number;
  code: string;
  createdAt: Date | null;
  amount: number;
  note: string | null;
  status: WalletRequestStatus;
  rejectReason: string | null;
}

export interface DepositFormState {
  amount: number | null;
  methodKey: string;
}
