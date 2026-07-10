/** Hướng dòng tiền của một giao dịch: vào ví hay ra khỏi ví. */
export type TransactionDirection = "in" | "out";

/** Preset nhanh cho biểu đồ — chỉ dùng để tô sáng nút đang chọn, khoảng ngày
 * thật nằm ở `DateRange` (đã hỗ trợ chọn tùy ý qua RangePicker). */
export type ChartPeriod = "week" | "month";

export interface DateRange {
  from: Date;
  to: Date;
}

export interface WalletInfo {
  id: number | null;
  balance: number;
}

export interface WalletTransaction {
  id: number;
  code: string;
  description: string;
  /** Enum thô từ backend: deposit|payment|refund|bonus|adjustment|expire — label/màu ở constants. */
  type: string;
  direction: TransactionDirection;
  amount: number;
  /** ⚠️ Backend KHÔNG trả field này (sổ cái bất biến) → mặc định `completed`. */
  status: string;
  createdAt: Date | null;
}

export interface WalletSummaryStats {
  totalIn: number;
  totalOut: number;
  successCount: number;
  failedCount: number;
  /** % so với tháng trước; null khi tháng trước không có dữ liệu để so. */
  totalInChange: number | null;
  totalOutChange: number | null;
  successCountChange: number | null;
  failedCountChange: number | null;
}

export interface ChartPoint {
  label: string;
  moneyIn: number;
  moneyOut: number;
}

export interface LinkedBankAccount {
  bankName: string;
  accountNumber: string;
  holderName: string;
  isDefault: boolean;
}
