export type InvoiceStatus =
  | "draft"
  | "pending"
  | "approved"
  | "pending_payment"
  | "partial"
  | "paid"
  | "cancelled"
  | "refunded"
  | "closed";

export interface InvoiceRow {
  id: number;
  code: string;
  studentId: number | null;
  studentName: string | null;
  serviceName: string;
  createdAt: string | null;
  dueDate: string | null;
  total: number;
  status: InvoiceStatus;
  paymentMethod: string | null;
}

export type InvoiceType = "receivable" | "payable";

export interface InvoiceItem {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoicePayment {
  id: number;
  amount: number;
  direction: string | null;
  method: string | null;
  status: string | null;
  transactionId: string | null;
  paidAt: string | null;
}

export interface InvoiceHistoryEntry {
  id: number;
  action: string;
  fromStatus: string | null;
  toStatus: string | null;
  reason: string | null;
  note: string | null;
  createdAt: string | null;
}

export interface InvoiceDetail {
  id: number;
  code: string;
  invoiceType: InvoiceType;
  status: InvoiceStatus;
  studentId: number | null;
  studentName: string | null;
  invoiceDate: string | null;
  dueDate: string | null;
  paidAt: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  balanceAmount: number;
  note: string | null;
  items: InvoiceItem[];
  payments: InvoicePayment[];
  histories: InvoiceHistoryEntry[];
}

export interface InvoiceSummary {
  revenueThisMonth: number;
  totalRevenue: number;
  pendingAmount: number;
  pendingCount: number;
  paidAmount: number;
  paidCount: number;
  refundedAmount: number;
  refundedCount: number;
  byPaymentMethod: Record<string, number>;
}

export type InvoiceTab = "all" | "pending_payment" | "paid" | "overdue" | "cancelled" | "refunded";
