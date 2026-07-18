export type WalletRequestStatus = "pending" | "approved" | "rejected" | "completed" | "cancelled";

/** Một dòng trong bảng "Lịch sử rút tiền" — dựng từ `fin/wallet-request/list?request_type=withdraw`. */
export interface WithdrawHistoryRow {
  id: number;
  code: string;
  requestedAt: Date | null;
  amount: number;
  fee: number;
  received: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: WalletRequestStatus;
  rejectReason: string | null;
}

/** Số liệu 2 tile dưới thẻ số dư — tính từ danh sách yêu cầu đã tải. */
export interface WithdrawStats {
  totalWithdrawn: number;
  totalWithdrawnCount: number;
  pendingAmount: number;
  pendingCount: number;
}
