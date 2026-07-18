import moment from "moment";

import type { InvoiceDetail, InvoiceRow, InvoiceSummary, InvoiceTab } from "./_interface";

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

/** ✅ Khớp `InvoiceResource` (`fin/invoice/detail/{id}`) — `data.invoice` + `data.histories`. */
export const toInvoiceDetail = (raw: any): InvoiceDetail | null => {
  const inv = raw?.data?.invoice;
  if (!inv) return null;

  return {
    id: inv.id,
    code: inv.code,
    invoiceType: inv.invoice_type,
    status: inv.status,
    studentId: inv.student_id ?? null,
    studentName: inv.student?.name ?? null,
    invoiceDate: inv.invoice_date ?? null,
    dueDate: inv.due_date ?? null,
    paidAt: inv.paid_at ?? null,
    subtotal: Number(inv.subtotal ?? 0),
    discount: Number(inv.discount ?? 0),
    tax: Number(inv.tax ?? 0),
    total: Number(inv.total ?? 0),
    paidAmount: Number(inv.paid_amount ?? 0),
    balanceAmount: Number(inv.balance_amount ?? 0),
    note: inv.note ?? null,
    items: (inv.items ?? []).map((item: any) => ({
      id: item.id,
      name: item.name,
      quantity: Number(item.quantity ?? 1),
      unitPrice: Number(item.unit_price ?? 0),
      total: Number(item.total ?? 0),
    })),
    payments: (inv.payments ?? []).map((p: any) => ({
      id: p.id,
      amount: Number(p.amount ?? 0),
      direction: p.payment_direction ?? null,
      method: p.method ?? null,
      status: p.status ?? null,
      transactionId: p.transaction_id ?? null,
      paidAt: p.paid_at ?? null,
    })),
    histories: (raw?.data?.histories ?? []).map((h: any) => ({
      id: h.id,
      action: h.action,
      fromStatus: h.from_status ?? null,
      toStatus: h.to_status ?? null,
      reason: h.reason ?? null,
      note: h.note ?? null,
      createdAt: h.created_at ?? null,
    })),
  };
};
