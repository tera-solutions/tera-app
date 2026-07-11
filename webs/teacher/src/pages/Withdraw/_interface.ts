/** Một dòng trong bảng "Lịch sử rút tiền". ⚠️ Chưa có endpoint — bảng luôn rỗng, xem `constants`. */
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
  /** Key trong `WITHDRAW_STATUS_CONFIG`. */
  status: string;
}

/** Số liệu 2 tile dưới thẻ số dư. ⚠️ Không có endpoint thống kê → tạm 0. */
export interface WithdrawStats {
  totalWithdrawn: number;
  totalWithdrawnCount: number;
  pendingAmount: number;
  pendingCount: number;
}
