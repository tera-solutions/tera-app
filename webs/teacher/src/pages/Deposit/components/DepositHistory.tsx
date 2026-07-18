import { NoSymbolOutlined } from "tera-dls";
import StatusBadge from "@tera/components/dof/StatusBadge";

import Card from "_common/components/Card";
import CompactSelect from "_common/components/CompactSelect";
import DateRangeFilter from "_common/components/DateRangeFilter";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import { useMeta } from "_common/hooks/useMeta";

import type { DateRange } from "../../Wallet/_interface";
import { formatDateTime, formatVnd } from "../../Wallet/_utils";
import type { DepositHistoryRow } from "../_interface";

interface DepositHistoryProps {
  rows: DepositHistoryRow[];
  total: number;
  page: number;
  perPage: number;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onPageChange: (page: number, perPage: number) => void;
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  /** Rỗng = tất cả trạng thái. Lọc client-side. */
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onCancel: (row: DepositHistoryRow) => void;
}

/** "Lịch sử nạp tiền" — `fin/wallet-request/list?request_type=deposit`. */
const DepositHistory = ({
  rows,
  total,
  page,
  perPage,
  isLoading,
  isError,
  onRetry,
  onPageChange,
  range,
  onRangeChange,
  statusFilter,
  onStatusFilterChange,
  onCancel,
}: DepositHistoryProps) => {
  const { getOptions } = useMeta();

  const columns: TableColumn<DepositHistoryRow>[] = [
    {
      key: "code",
      title: "Mã yêu cầu",
      render: (r) => (
        <span className="whitespace-nowrap font-medium text-brand">{r.code}</span>
      ),
    },
    {
      key: "created_at",
      title: "Ngày gửi",
      render: (r) => (
        <span className="whitespace-nowrap text-slate-600">{formatDateTime(r.createdAt)}</span>
      ),
    },
    {
      key: "note",
      title: "Ghi chú",
      render: (r) => <span className="block max-w-[220px] truncate text-slate-600">{r.note ?? "—"}</span>,
    },
    {
      key: "amount",
      title: "Số tiền",
      render: (r) => (
        <span className="whitespace-nowrap font-semibold text-slate-700">
          {formatVnd(r.amount)}
        </span>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (r) => (
        <div>
          <StatusBadge name="wallet_request_status" value={r.status} className="whitespace-nowrap" />
          {r.status === "rejected" && r.rejectReason && (
            <p className="mt-1 max-w-[180px] truncate text-[11px] text-rose-500">{r.rejectReason}</p>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      title: "",
      cellClassName: "px-2 py-3 text-right",
      render: (r) =>
        r.status === "pending" ? (
          <button
            type="button"
            onClick={() => onCancel(r)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
            aria-label="Hủy yêu cầu"
            title="Hủy yêu cầu"
          >
            <NoSymbolOutlined className="h-4 w-4" />
          </button>
        ) : null,
    },
  ];

  return (
    <Card className="xmd:p-5" animated={false}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-base font-semibold text-slate-800">Lịch sử nạp tiền</p>
        <div className="flex w-full items-center justify-end gap-2 xmd:w-auto">
          <CompactSelect
            value={statusFilter}
            options={getOptions("wallet_request_status")}
            placeholder="Tất cả trạng thái"
            allowClear
            className="h-9 min-w-0 text-[13px]"
            onChange={onStatusFilterChange}
          />
          <DateRangeFilter value={range} onChange={onRangeChange} />
        </div>
      </div>

      <Table
        columns={columns}
        data={rows}
        rowKey={(r) => r.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        emptyText={
          statusFilter
            ? "Không có yêu cầu nào ở trạng thái này"
            : "Chưa có yêu cầu nạp tiền nào"
        }
      />

      <TablePagination
        total={total}
        page={page}
        perPage={perPage}
        unit="yêu cầu"
        onChange={onPageChange}
      />
    </Card>
  );
};

export default DepositHistory;
