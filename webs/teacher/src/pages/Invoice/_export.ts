import { downloadCsv } from "_common/utils/csv";

import type { InvoiceRow } from "./_interface";
import { formatCurrency } from "./_utils";

/**
 * Xuất CSV phía client từ danh sách hóa đơn đã tải — backend không có route
 * export/download riêng cho hóa đơn (`fin/invoice/*` chỉ có list/detail/...).
 */
export const exportInvoicesCsv = (
  invoices: InvoiceRow[],
  getStatusLabel: (value?: string | null) => string,
) => {
  const header = ["Mã hóa đơn", "Học viên", "Dịch vụ", "Ngày tạo", "Hạn thanh toán", "Tổng tiền", "Trạng thái"];
  const rows = invoices.map((inv) => [
    inv.code,
    inv.studentName ?? "",
    inv.serviceName,
    inv.createdAt ?? "",
    inv.dueDate ?? "",
    formatCurrency(inv.total),
    getStatusLabel(inv.status),
  ]);

  downloadCsv(`hoa-don-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...rows]);
};
