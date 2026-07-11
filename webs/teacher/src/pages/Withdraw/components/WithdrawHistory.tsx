import { ArrowDownTrayOutlined, notification } from "tera-dls";

import Card from "_common/components/Card";
import CompactSelect from "_common/components/CompactSelect";
import DateRangeFilter from "_common/components/DateRangeFilter";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";

import type { DateRange } from "../../Wallet/_interface";
import { formatDateTime, formatVnd, maskAccountNumber } from "../../Wallet/_utils";
import { STATUS_FILTER_OPTIONS } from "../constants";
import type { WithdrawHistoryRow } from "../_interface";
import WithdrawStatus from "./WithdrawStatus";

interface WithdrawHistoryProps {
  rows: WithdrawHistoryRow[];
  total: number;
  page: number;
  perPage: number;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onPageChange: (page: number, perPage: number) => void;
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

/** "Lịch sử rút tiền". ⚠️ Chưa có endpoint → bảng luôn rỗng; bố cục sẵn để nối API sau. */
const WithdrawHistory = ({
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
}: WithdrawHistoryProps) => {
  // 🚫 Không có endpoint hóa đơn cho yêu cầu rút tiền.
  const notReady = () =>
    notification.warning({ message: "Tính năng đang được phát triển" });

  const columns: TableColumn<WithdrawHistoryRow>[] = [
    {
      key: "code",
      title: "Mã giao dịch",
      render: (r) => (
        <span className="whitespace-nowrap font-medium text-brand">{r.code}</span>
      ),
    },
    {
      key: "requested_at",
      title: "Ngày yêu cầu",
      render: (r) => (
        <span className="whitespace-nowrap text-slate-600">{formatDateTime(r.requestedAt)}</span>
      ),
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
      key: "fee",
      title: "Phí giao dịch",
      render: (r) => (
        <span className="whitespace-nowrap text-emerald-600">
          {r.fee === 0 ? "Miễn phí" : formatVnd(r.fee)}
        </span>
      ),
    },
    {
      key: "received",
      title: "Số tiền nhận",
      render: (r) => (
        <span className="whitespace-nowrap font-semibold text-emerald-600">
          {formatVnd(r.received)}
        </span>
      ),
    },
    {
      key: "bank",
      title: "Tài khoản nhận",
      render: (r) => (
        <span className="block min-w-[180px] leading-tight">
          <span className="block text-slate-700">
            {r.bankName} - {maskAccountNumber(r.accountNumber)}
          </span>
          <span className="mt-0.5 block text-xs text-slate-400">{r.accountHolder}</span>
        </span>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (r) => <WithdrawStatus status={r.status} />,
    },
    {
      key: "actions",
      title: "",
      cellClassName: "px-2 py-3 text-right",
      render: () => (
        <button
          type="button"
          onClick={notReady}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label="Tải hóa đơn"
          title="Tải hóa đơn"
        >
          <ArrowDownTrayOutlined className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <Card className="xmd:p-5" animated={false}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-base font-semibold text-slate-800">Lịch sử rút tiền</p>
        {/* Cùng kiểu hàng control của "Lịch sử nạp tiền": không `flex-wrap`, picker tự co. */}
        <div className="flex w-full items-center justify-end gap-2 xmd:w-auto">
          <CompactSelect
            value={statusFilter}
            options={STATUS_FILTER_OPTIONS}
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
            : "Chưa có giao dịch rút tiền nào"
        }
      />

      <TablePagination
        total={total}
        page={page}
        perPage={perPage}
        unit="giao dịch"
        onChange={onPageChange}
      />
    </Card>
  );
};

export default WithdrawHistory;
