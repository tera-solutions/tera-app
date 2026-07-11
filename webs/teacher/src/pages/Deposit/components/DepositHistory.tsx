import classNames from "classnames";
import { ArrowDownTrayOutlined, notification } from "tera-dls";

import Badge from "_common/components/Badge";
import Card from "_common/components/Card";
import CompactSelect from "_common/components/CompactSelect";
import DateRangeFilter from "_common/components/DateRangeFilter";
import IconBox from "_common/components/IconBox";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";

import type { DateRange } from "../../Wallet/_interface";
import { STATUS_CONFIG } from "../../Wallet/constants";
import { formatDateTime, formatVnd } from "../../Wallet/_utils";
import { DEPOSIT_METHODS, STATUS_FILTER_OPTIONS } from "../constants";
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
  /** Rỗng = tất cả trạng thái. Lọc client-side — xem `STATUS_FILTER_OPTIONS`. */
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

/** Ô "Phương thức": logo + tên, suy từ `description`. Không nhận ra thì hiện icon chung. */
const MethodCell = ({ methodKey }: { methodKey: string | null }) => {
  const method = DEPOSIT_METHODS.find((m) => m.key === methodKey);
  return (
    <span className="flex items-center gap-2 whitespace-nowrap">
      <IconBox
        icon={method?.icon ?? <ArrowDownTrayOutlined />}
        sizeClassName="h-7 w-7"
        roundedClassName="rounded-lg"
        colorClassName={method?.iconClassName ?? "bg-slate-100 text-slate-400"}
        iconSizeClassName="[&_svg]:h-4 [&_svg]:w-4"
      />
      <span className="text-slate-600">{method?.name ?? "Khác"}</span>
    </span>
  );
};

/** "Lịch sử nạp tiền" — chính là `fin/wallet/transactions?transaction_type=deposit`,
 * không cần endpoint riêng. */
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
}: DepositHistoryProps) => {
  // 🚫 Không có endpoint hóa đơn cho giao dịch ví → chưa gọi được gì.
  const invoiceNotReady = () =>
    notification.warning({ message: "Tính năng đang được phát triển" });

  const columns: TableColumn<DepositHistoryRow>[] = [
    {
      key: "code",
      title: "Mã giao dịch",
      render: (r) => (
        <span className="whitespace-nowrap font-medium text-brand">{r.code}</span>
      ),
    },
    {
      key: "created_at",
      title: "Ngày nạp",
      render: (r) => (
        <span className="whitespace-nowrap text-slate-600">{formatDateTime(r.createdAt)}</span>
      ),
    },
    {
      key: "method",
      title: "Phương thức",
      render: (r) => <MethodCell methodKey={r.methodKey} />,
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
      key: "status",
      title: "Trạng thái",
      render: (r) => {
        const cfg = STATUS_CONFIG[r.status];
        return (
          <Badge
            className={classNames(
              "whitespace-nowrap px-2.5 py-0.5 text-[11px]",
              cfg?.className ?? "bg-slate-100 text-slate-500",
            )}
          >
            {cfg?.label ?? r.status}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      title: "",
      cellClassName: "px-2 py-3 text-right",
      render: () => (
        <button
          type="button"
          onClick={invoiceNotReady}
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
        <p className="text-base font-semibold text-slate-800">Lịch sử nạp tiền</p>
        {/* Giống hàng control của "Biểu đồ giao dịch": `justify-end` (mobile khối này xuống dòng
            và chiếm hết bề ngang, không có nó thì 2 control dồn về trái) và KHÔNG `flex-wrap`
            (picker tự co nhờ `flex-1 min-w-0` nên 2 control luôn cùng 1 hàng). */}
        <div className="flex w-full items-center justify-end gap-2 xmd:w-auto">
          <CompactSelect
            value={statusFilter}
            options={STATUS_FILTER_OPTIONS}
            placeholder="Tất cả trạng thái"
            allowClear
            /* `min-w-0` (không `shrink-0`): "Tất cả trạng thái" dài hơn "Tùy chọn" bên biểu đồ,
               trên mobile nó bóp picker khiến chữ ngày bị cắt → cho select nhường chỗ + truncate. */
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
            ? "Không có giao dịch nào ở trạng thái này"
            : "Chưa có giao dịch nạp tiền nào"
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

export default DepositHistory;
