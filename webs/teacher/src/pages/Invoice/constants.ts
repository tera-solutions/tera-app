import type { InvoiceStatus } from "./_interface";

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Nháp",
  pending: "Chưa thanh toán",
  approved: "Đã duyệt",
  pending_payment: "Chờ thanh toán",
  partial: "Thanh toán một phần",
  paid: "Đã thanh toán",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền",
  closed: "Đã đóng",
};

export const INVOICE_STATUS_BADGE: Record<InvoiceStatus, string> = {
  draft: "bg-slate-100 text-slate-500",
  pending: "bg-amber-50 text-amber-600",
  approved: "bg-sky-50 text-brand",
  pending_payment: "bg-amber-50 text-amber-600",
  partial: "bg-sky-50 text-brand",
  paid: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-slate-100 text-slate-500",
  refunded: "bg-violet-50 text-violet-600",
  closed: "bg-slate-100 text-slate-500",
};

export const INVOICE_TAB_OPTIONS: { key: string; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending_payment", label: "Chờ thanh toán" },
  { key: "paid", label: "Đã thanh toán" },
  { key: "overdue", label: "Quá hạn" },
  { key: "cancelled", label: "Đã hủy" },
  { key: "refunded", label: "Hoàn tiền" },
];

export const INVOICE_STATUS_FILTER_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  ...Object.entries(INVOICE_STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

export const PAYMENT_METHOD_COLORS: Record<string, string> = {
  bank_transfer: "#0ea5e9",
  wallet: "#10b981",
  cash: "#f59e0b",
  other: "#94a3b8",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank_transfer: "Chuyển khoản",
  wallet: "Ví Hana Edu",
  cash: "Tiền mặt",
  other: "Khác",
};
