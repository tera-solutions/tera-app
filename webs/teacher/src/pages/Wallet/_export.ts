import { downloadCsv } from "_common/utils/csv";

import type { WalletTransaction } from "./_interface";
import { formatDateTime } from "./_utils";
import { TYPE_CONFIG } from "./constants";

/**
 * Xuất CSV phía client từ danh sách giao dịch đã tải — backend không có route
 * export cho ví (`fin/wallet/*` chỉ có list/detail/transactions, xem `wallet.api.ts`).
 */
export const exportTransactionsCsv = (transactions: WalletTransaction[]) => {
  const header = ["Mã giao dịch", "Loại", "Mô tả", "Số tiền", "Chiều", "Thời gian"];
  const rows = transactions.map((t) => [
    t.code,
    TYPE_CONFIG[t.type]?.label ?? t.type,
    t.description,
    t.amount,
    t.direction === "in" ? "Vào ví" : "Ra khỏi ví",
    formatDateTime(t.createdAt),
  ]);

  downloadCsv(`giao-dich-vi-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...rows]);
};
