/** Một dòng trong bảng "Lịch sử nạp tiền" — dựng từ giao dịch `transaction_type: "deposit"`. */
export interface DepositHistoryRow {
  id: number;
  code: string;
  createdAt: Date | null;
  /** Key trong `DEPOSIT_METHODS`, suy ngược từ `description`. `null` = không nhận ra (vd kế toán
   * nhập tay từ web admin) → hiển thị icon chung. */
  methodKey: string | null;
  amount: number;
  /** Backend không trừ phí → luôn 0. Giữ field để khi có bảng phí thì đọc từ API. */
  fee: number;
  received: number;
  /** Sổ cái bất biến, không có giao dịch treo/thất bại → luôn `completed`. */
  status: string;
}

export interface DepositFormState {
  amount: number | null;
  methodKey: string;
}
