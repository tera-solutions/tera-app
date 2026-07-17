import moment from "moment";

import Badge from "_common/components/Badge";
import Table, { TableColumn } from "_common/components/Table";

import type { SubscriptionInvoiceRow } from "../_interface";
import { formatCurrency } from "../_utils";

interface InvoiceHistoryTableProps {
  items: SubscriptionInvoiceRow[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const STATUS_LABELS: Record<string, string> = { paid: "Đã thanh toán", pending: "Chờ thanh toán", failed: "Thất bại" };
const STATUS_BADGE: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-600",
  pending: "bg-amber-50 text-amber-600",
  failed: "bg-red-50 text-red-600",
};

const InvoiceHistoryTable = ({ items, loading, isError, onRetry }: InvoiceHistoryTableProps) => {
  const columns: TableColumn<SubscriptionInvoiceRow>[] = [
    { key: "code", title: "Mã hóa đơn", render: (row) => <span className="font-medium text-brand">{row.code}</span> },
    {
      key: "paid_at",
      title: "Ngày thanh toán",
      render: (row) => (row.paidAt ? moment(row.paidAt).format("DD/MM/YYYY HH:mm") : "—"),
    },
    { key: "package", title: "Gói dịch vụ", render: (row) => row.packageName },
    { key: "cycle", title: "Chu kỳ", render: (row) => (row.billingCycle === "year" ? "1 năm" : "1 tháng") },
    { key: "amount", title: "Số tiền", render: (row) => formatCurrency(row.amount) },
    { key: "method", title: "Phương thức thanh toán", render: (row) => row.paymentMethod ?? "—" },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => (
        <Badge className={`px-2.5 py-1 text-xs ${STATUS_BADGE[row.status] ?? STATUS_BADGE.pending}`}>
          {STATUS_LABELS[row.status] ?? row.status}
        </Badge>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={items}
      rowKey={(row) => row.id}
      isLoading={loading}
      isError={isError}
      onRetry={onRetry}
      errorMessage="Không tải được lịch sử hóa đơn gói"
      emptyText="Chưa có hóa đơn nào"
      minWidthClassName="min-w-200"
    />
  );
};

export default InvoiceHistoryTable;
