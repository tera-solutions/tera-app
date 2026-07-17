import moment from "moment";
import { DocumentArrowDownOutlined, EyeOutlined, notification } from "tera-dls";

import Avatar from "_common/components/Avatar";
import Badge from "_common/components/Badge";
import Table, { TableColumn } from "_common/components/Table";
import TableRowActions from "_common/components/TableRowActions";

import type { InvoiceRow } from "../_interface";
import { INVOICE_STATUS_BADGE, INVOICE_STATUS_LABELS } from "../constants";
import { formatCurrency } from "../_utils";

interface InvoiceTableProps {
  items: InvoiceRow[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onView: (row: InvoiceRow) => void;
}

const InvoiceTable = ({ items, loading, isError, onRetry, onView }: InvoiceTableProps) => {
  const columns: TableColumn<InvoiceRow>[] = [
    {
      key: "code",
      title: "Mã hóa đơn",
      render: (row) => <span className="font-medium text-brand">{row.code}</span>,
    },
    {
      key: "student",
      title: "Học viên",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar sizeClassName="h-7 w-7" />
          <span className="truncate">{row.studentName ?? "—"}</span>
        </div>
      ),
    },
    { key: "service", title: "Dịch vụ", render: (row) => row.serviceName },
    {
      key: "created",
      title: "Ngày tạo",
      render: (row) => (row.createdAt ? moment(row.createdAt).format("DD/MM/YYYY") : "—"),
    },
    {
      key: "due",
      title: "Hạn thanh toán",
      render: (row) => (row.dueDate ? moment(row.dueDate).format("DD/MM/YYYY") : "—"),
    },
    {
      key: "total",
      title: "Số tiền",
      render: (row) => <span className="font-semibold text-slate-800">{formatCurrency(row.total)}</span>,
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => (
        <Badge className={`px-2.5 py-1 text-xs ${INVOICE_STATUS_BADGE[row.status]}`}>
          {INVOICE_STATUS_LABELS[row.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      title: "",
      headerClassName: "w-20",
      render: (row) => (
        <TableRowActions
          buttons={[
            { title: "Xem", icon: <EyeOutlined />, onClick: () => onView(row) },
            {
              title: "Tải hóa đơn",
              icon: <DocumentArrowDownOutlined />,
              onClick: () => notification.warning({ message: "Tính năng đang được phát triển" }),
            },
          ]}
        />
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
      errorMessage="Không tải được danh sách hóa đơn"
      emptyText="Không có hóa đơn phù hợp"
      minWidthClassName="min-w-200"
      onRowClick={onView}
    />
  );
};

export default InvoiceTable;
