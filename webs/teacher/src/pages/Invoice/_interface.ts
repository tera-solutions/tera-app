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
