import { ArrowDownTrayOutlined, Button, EyeOutlined } from "tera-dls";

import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";

import type { PayrollRow } from "../_interface";
import { formatVnd, periodLabel } from "../_utils";

interface PayrollTableProps {
  rows: PayrollRow[];
  total: number;
  page: number;
  perPage: number;
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onPageChange: (page: number, perPage: number) => void;
  onView: (row: PayrollRow) => void;
  onExport: () => void;
}

const money = (value: number) => (
  <span className="whitespace-nowrap text-slate-600">{formatVnd(value)}</span>
);

const PayrollTable = ({
  rows,
  total,
  page,
  perPage,
  loading,
  isError,
  onRetry,
  onPageChange,
  onView,
  onExport,
}: PayrollTableProps) => {
  const columns: TableColumn<PayrollRow>[] = [
    {
      key: "period",
      title: "Kỳ lương",
      render: (r) => (
        <span className="whitespace-nowrap font-medium text-slate-700">
          {periodLabel(r.month, r.year)}
        </span>
      ),
    },
    { key: "totalHours", title: "Giờ dạy", render: (r) => <span className="whitespace-nowrap text-slate-600">{r.totalHours}h</span> },
    { key: "baseSalary", title: "Lương cơ bản", render: (r) => money(r.baseSalary) },
    { key: "bonus", title: "Thưởng", render: (r) => money(r.bonus) },
    { key: "penalty", title: "Phạt", render: (r) => <span className="whitespace-nowrap text-rose-500">{formatVnd(r.penalty)}</span> },
    { key: "totalSalary", title: "Thực lãnh", render: (r) => <span className="whitespace-nowrap font-semibold text-brand">{formatVnd(r.totalSalary)}</span> },
    {
      key: "actions",
      title: "",
      cellClassName: "px-4 py-3",
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onView(r);
          }}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-sky-50 hover:text-brand"
          aria-label="Xem chi tiết bảng lương"
        >
          <EyeOutlined className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Button icon={<ArrowDownTrayOutlined />} onClick={onExport} className="whitespace-nowrap bg-brand hover:bg-brand/80">
          Xuất file
        </Button>
      </div>

      <Table
        columns={columns}
        data={rows}
        rowKey={(r) => r.id}
        isLoading={loading}
        isError={isError}
        onRetry={onRetry}
        emptyText="Chưa có kỳ lương nào"
        minWidthClassName="min-w-[860px]"
        onRowClick={onView}
      />

      <TablePagination total={total} page={page} perPage={perPage} unit="kỳ lương" onChange={onPageChange} />
    </div>
  );
};

export default PayrollTable;
