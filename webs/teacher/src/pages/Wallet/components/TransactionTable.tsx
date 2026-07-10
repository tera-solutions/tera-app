import { useState } from "react";
import classNames from "classnames";
import {
  ArrowDownTrayOutlined,
  Button,
  EllipsisVerticalOutlined,
  Modal,
} from "tera-dls";

import Badge from "_common/components/Badge";
import Card from "_common/components/Card";
import CompactSelect from "_common/components/CompactSelect";
import SearchInput from "_common/components/SearchInput";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";

import type { WalletTransaction } from "../_interface";
import { formatDateTime, formatVnd } from "../_utils";
import { STATUS_CONFIG, TYPE_CONFIG, TYPE_FILTER_OPTIONS } from "../constants";

interface TransactionTableProps {
  transactions: WalletTransaction[];
  total: number;
  page: number;
  perPage: number;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onPageChange: (page: number, perPage: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  onExport: () => void;
  exporting?: boolean;
}

const TypeBadge = ({ type }: { type: string }) => {
  const cfg = TYPE_CONFIG[type];
  return (
    <Badge
      className={classNames(
        "px-2.5 py-0.5 text-[11px]",
        cfg?.className ?? "bg-slate-100 text-slate-500",
      )}
    >
      {cfg?.label ?? type ?? "—"}
    </Badge>
  );
};

const TransactionStatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <Badge
      className={classNames(
        "px-2.5 py-0.5 text-[11px]",
        cfg?.className ?? "bg-slate-100 text-slate-500",
      )}
    >
      {cfg?.label ?? status ?? "—"}
    </Badge>
  );
};

/** "Lịch sử giao dịch" — tìm kiếm + lọc loại + xuất file + bảng phân trang. */
const TransactionTable = ({
  transactions,
  total,
  page,
  perPage,
  isLoading,
  isError,
  onRetry,
  onPageChange,
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  onExport,
  exporting,
}: TransactionTableProps) => {
  const [detail, setDetail] = useState<WalletTransaction | null>(null);

  const columns: TableColumn<WalletTransaction>[] = [
    {
      key: "created_at",
      title: "Ngày giao dịch",
      render: (t) => (
        <span className="whitespace-nowrap text-slate-600">
          {formatDateTime(t.createdAt)}
        </span>
      ),
    },
    {
      key: "code",
      title: "Mã giao dịch",
      render: (t) => (
        <span className="whitespace-nowrap font-medium text-slate-700">{t.code}</span>
      ),
    },
    {
      key: "description",
      title: "Nội dung",
      render: (t) => (
        <span className="line-clamp-2 min-w-[180px] text-slate-600">{t.description}</span>
      ),
    },
    {
      key: "type",
      title: "Loại giao dịch",
      render: (t) => <TypeBadge type={t.type} />,
    },
    {
      key: "amount",
      title: "Số tiền",
      render: (t) => (
        <span
          className={classNames(
            "whitespace-nowrap font-semibold",
            t.direction === "in" ? "text-emerald-600" : "text-rose-500",
          )}
        >
          {t.direction === "in" ? "+" : "-"}
          {formatVnd(t.amount)}
        </span>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (t) => <TransactionStatusBadge status={t.status} />,
    },
    {
      key: "actions",
      title: "",
      cellClassName: "px-2 py-3 text-right",
      render: (t) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDetail(t);
          }}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label="Xem chi tiết giao dịch"
        >
          <EllipsisVerticalOutlined className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <Card className="xmd:p-5" animated={false}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-base font-semibold text-slate-800">Lịch sử giao dịch</p>
        <div className="flex items-center gap-2">
          <CompactSelect
            value={typeFilter}
            options={TYPE_FILTER_OPTIONS}
            placeholder="Tất cả giao dịch"
            allowClear
            className="h-9"
            onChange={onTypeFilterChange}
          />
          <Button
            type="light"
            className="btn-info flex! h-9! items-center! gap-1.5 px-3"
            onClick={onExport}
            loading={exporting}
          >
            <ArrowDownTrayOutlined className="h-4 w-4" />
            <span className="text-xs font-medium">Xuất file</span>
          </Button>
        </div>
      </div>

      <SearchInput
        placeholder="Tìm kiếm giao dịch..."
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
        wrapperClassName="mb-3"
      />

      <Table
        columns={columns}
        data={transactions}
        rowKey={(t) => t.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        emptyText="Chưa có giao dịch nào"
        minWidthClassName="min-w-[720px]"
        onRowClick={(t) => setDetail(t)}
      />

      <TablePagination
        total={total}
        page={page}
        perPage={perPage}
        unit="giao dịch"
        onChange={onPageChange}
      />

      <Modal
        title="Chi tiết giao dịch"
        open={!!detail}
        className="!w-[92%] xmd:!w-[480px]"
        okText="Đóng"
        cancelText="Hủy"
        onOk={() => setDetail(null)}
        onCancel={() => setDetail(null)}
        destroyOnClose
      >
        {detail && (
          <div className="divide-y divide-slate-100 text-sm">
            {[
              ["Mã giao dịch", detail.code],
              ["Thời gian", formatDateTime(detail.createdAt)],
              ["Nội dung", detail.description],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4 py-2.5">
                <span className="shrink-0 text-slate-400">{label}</span>
                <span className="text-right font-medium text-slate-700">{value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-slate-400">Loại giao dịch</span>
              <TypeBadge type={detail.type} />
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-slate-400">Số tiền</span>
              <span
                className={classNames(
                  "font-semibold",
                  detail.direction === "in" ? "text-emerald-600" : "text-rose-500",
                )}
              >
                {detail.direction === "in" ? "+" : "-"}
                {formatVnd(detail.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-slate-400">Trạng thái</span>
              <TransactionStatusBadge status={detail.status} />
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default TransactionTable;
