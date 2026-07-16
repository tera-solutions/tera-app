import moment from "moment";

import type { InvoiceRow, InvoiceSummary, InvoiceTab } from "./_interface";

export const toInvoices = (raw: any): InvoiceRow[] =>
  (raw?.data?.items ?? []).map((item: any) => ({
    id: item.id,
    code: item.code,
    studentId: item.student_id ?? null,
    studentName: item.student?.name ?? null,
    serviceName: item.items?.[0]?.name ?? item.note ?? "Học phí",
    createdAt: item.invoice_date ?? item.created_at ?? null,
    dueDate: item.due_date ?? null,
    total: Number(item.total ?? 0),
    status: item.status ?? "pending",
    paymentMethod: item.payments?.[item.payments.length - 1]?.method ?? null,
  }));

export const filterByTab = (items: InvoiceRow[], tab: InvoiceTab): InvoiceRow[] => {
  const today = moment().startOf("day");
  switch (tab) {
    case "pending_payment":
      return items.filter((i) => ["pending", "pending_payment", "partial", "approved"].includes(i.status));
    case "paid":
      return items.filter((i) => i.status === "paid");
    case "overdue":
      return items.filter(
        (i) =>
          i.dueDate &&
          moment(i.dueDate).isBefore(today) &&
          !["paid", "cancelled", "refunded", "closed"].includes(i.status),
      );
    case "cancelled":
      return items.filter((i) => i.status === "cancelled");
    case "refunded":
      return items.filter((i) => i.status === "refunded");
    default:
      return items;
  }
};

export const summarizeInvoices = (items: InvoiceRow[]): InvoiceSummary => {
  const startOfMonth = moment().startOf("month");
  let revenueThisMonth = 0;
  let totalRevenue = 0;
  let pendingAmount = 0;
  let pendingCount = 0;
  let paidAmount = 0;
  let paidCount = 0;
  let refundedAmount = 0;
  let refundedCount = 0;
  const byPaymentMethod: Record<string, number> = {};

  items.forEach((item) => {
    if (item.status === "paid") {
      totalRevenue += item.total;
      paidAmount += item.total;
      paidCount += 1;
      if (item.createdAt && moment(item.createdAt).isSameOrAfter(startOfMonth)) {
        revenueThisMonth += item.total;
      }
      const method = item.paymentMethod ?? "other";
      byPaymentMethod[method] = (byPaymentMethod[method] ?? 0) + item.total;
    } else if (["pending", "pending_payment", "partial", "approved"].includes(item.status)) {
      pendingAmount += item.total;
      pendingCount += 1;
    } else if (item.status === "refunded") {
      refundedAmount += item.total;
      refundedCount += 1;
    }
  });

  return {
    revenueThisMonth,
    totalRevenue,
    pendingAmount,
    pendingCount,
    paidAmount,
    paidCount,
    refundedAmount,
    refundedCount,
    byPaymentMethod,
  };
};

export const formatCurrency = (value: number): string =>
  `${Math.round(value).toLocaleString("vi-VN")}đ`;
