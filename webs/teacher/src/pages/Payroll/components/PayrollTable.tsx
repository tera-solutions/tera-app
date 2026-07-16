import { useEffect, useState } from "react";
import {
  ArrowDownTrayOutlined,
  Button,
  DocumentArrowDownOutlined,
  EyeOutlined,
  FunnelOutlined,
  Modal,
} from "tera-dls";

// ChipGroup = UI "bộ lọc nâng cao" dùng chung (dof, không phụ thuộc i18n). Nút "Lọc" + modal
// thì dựng local vì FilterButton/FilterModalShell của dof dùng t() mà web teacher không có i18n.
import ChipGroup from "@tera/components/dof/ChipGroup";

import CompactSelect from "_common/components/CompactSelect";
import DateRangeFilter, { DateRangeValue } from "_common/components/DateRangeFilter";
import SearchInput from "_common/components/SearchInput";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";

import type { PayrollPeriod } from "../_interface";
import { formatVnd, INCOME_TYPE_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from "../_utils";
import PayrollStatusBadge from "./PayrollStatusBadge";

interface PayrollTableProps {
  rows: PayrollPeriod[];
  total: number;
  page: number;
  perPage: number;
  onPageChange: (page: number, perPage: number) => void;
  range: DateRangeValue;
  onRangeChange: (range: DateRangeValue) => void;
  incomeType: string;
  onIncomeTypeChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onView: (row: PayrollPeriod) => void;
  onExport: () => void;
  onDownloadRow: (row: PayrollPeriod) => void;
}

const money = (value: number) => (
  <span className="whitespace-nowrap text-slate-600">{formatVnd(value)}</span>
);

const PayrollTable = ({
  rows,
  total,
  page,
  perPage,
  onPageChange,
  range,
  onRangeChange,
  incomeType,
  onIncomeTypeChange,
  status,
  onStatusChange,
  search,
  onSearchChange,
  onView,
  onExport,
  onDownloadRow,
}: PayrollTableProps) => {
  // Bộ lọc nâng cao (mobile): 2 select ẩn đi, gom vào modal chip. Sửa bản nháp rồi Áp dụng.
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftIncomeType, setDraftIncomeType] = useState(incomeType);
  const [draftStatus, setDraftStatus] = useState(status);
  const activeCount = (incomeType ? 1 : 0) + (status ? 1 : 0);

  // Đồng bộ bản nháp = giá trị đang áp dụng mỗi khi mở modal.
  useEffect(() => {
    if (filterOpen) {
      setDraftIncomeType(incomeType);
      setDraftStatus(status);
    }
  }, [filterOpen, incomeType, status]);

  const columns: TableColumn<PayrollPeriod>[] = [
    {
      key: "period",
      title: "Kỳ lương",
      render: (r) => <span className="whitespace-nowrap font-medium text-slate-700">{r.period}</span>,
    },
    { key: "fromDate", title: "Từ ngày", render: (r) => <span className="whitespace-nowrap text-slate-600">{r.fromDate}</span> },
    { key: "toDate", title: "Đến ngày", render: (r) => <span className="whitespace-nowrap text-slate-600">{r.toDate}</span> },
    { key: "incomeType", title: "Loại thu nhập", render: (r) => <span className="whitespace-nowrap text-slate-600">{r.incomeType}</span> },
    { key: "baseSalary", title: "Lương cơ bản", render: (r) => money(r.baseSalary) },
    { key: "bonus", title: "Thưởng", render: (r) => money(r.bonus) },
    { key: "allowance", title: "Phụ cấp", render: (r) => money(r.allowance) },
    { key: "deduction", title: "Khấu trừ", render: (r) => <span className="whitespace-nowrap text-rose-500">{formatVnd(r.deduction)}</span> },
    { key: "grossIncome", title: "Tổng thu nhập", render: (r) => <span className="whitespace-nowrap font-semibold text-slate-700">{formatVnd(r.grossIncome)}</span> },
    { key: "netIncome", title: "Thực nhận", render: (r) => <span className="whitespace-nowrap font-semibold text-emerald-600">{formatVnd(r.netIncome)}</span> },
    { key: "status", title: "Trạng thái", render: (r) => <PayrollStatusBadge status={r.status} /> },
    { key: "paidDate", title: "Ngày thanh toán", render: (r) => <span className="whitespace-nowrap text-slate-600">{r.paidDate}</span> },
    {
      key: "actions",
      title: "Thao tác",
      cellClassName: "px-4 py-3",
      render: (r) => (
        <div className="flex items-center gap-1">
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
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDownloadRow(r);
            }}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Tải bảng lương"
          >
            <DocumentArrowDownOutlined className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* flex-wrap ở MỌI kích thước (không flex-col) → ô search flex-1 lấp khoảng trống, tránh
          bên phải bị trống khi ở khoảng ~768–1279px. */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {/* DateRange + nút "Lọc" cùng 1 hàng; mobile xuống DƯỚI (order-2), desktop giữ đầu (contents). */}
        <div className="order-2 flex items-center gap-2 xmd:contents">
          <DateRangeFilter value={range} onChange={onRangeChange} className="xmd:max-w-[240px]" />
          {/* Mobile: nút "Lọc" mở modal bộ lọc nâng cao (thay 2 select ẩn). */}
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-600 transition-colors hover:border-blue-500 hover:text-blue-600 xmd:hidden"
          >
            <FunnelOutlined className="h-4 w-4" />
            <span>Lọc</span>
            {activeCount > 0 && (
              <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 text-[11px] leading-none text-white">
                {activeCount}
              </span>
            )}
          </button>
        </div>
        {/* Desktop: 2 select inline (mobile ẩn, thay bằng nút "Lọc"). */}
        <div className="hidden xmd:contents">
          <CompactSelect
            value={incomeType}
            options={INCOME_TYPE_FILTER_OPTIONS}
            placeholder="Tất cả loại thu nhập"
            allowClear
            className="h-9 xmd:w-auto"
            onChange={onIncomeTypeChange}
          />
          <CompactSelect
            value={status}
            options={STATUS_FILTER_OPTIONS}
            placeholder="Tất cả trạng thái"
            allowClear
            className="h-9 xmd:w-auto"
            onChange={onStatusChange}
          />
        </div>
        <SearchInput
          placeholder="Tìm kiếm bảng lương..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          wrapperClassName="order-1 flex-1 min-w-[180px] xmd:order-none"
        />
        <Button
          icon={<ArrowDownTrayOutlined />}
          onClick={onExport}
          className="order-1 whitespace-nowrap bg-brand hover:bg-brand/80 xmd:order-none"
        >
          Xuất Excel
        </Button>
      </div>

      <Table
        columns={columns}
        data={rows}
        rowKey={(r) => r.id}
        emptyText="Không có kỳ lương phù hợp"
        minWidthClassName="min-w-[1100px]"
        onRowClick={onView}
      />

      <TablePagination total={total} page={page} perPage={perPage} unit="bản ghi" onChange={onPageChange} />

      <Modal
        title="Bộ lọc nâng cao"
        open={filterOpen}
        onCancel={() => setFilterOpen(false)}
        centered
        width="92%"
        className="max-w-[420px]!"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setDraftIncomeType("");
                setDraftStatus("");
              }}
              className="border border-slate-200! bg-white! text-slate-600! hover:border-brand! hover:text-brand!"
            >
              Chọn lại
            </Button>
            <Button
              onClick={() => {
                onIncomeTypeChange(draftIncomeType);
                onStatusChange(draftStatus);
                setFilterOpen(false);
              }}
              className="bg-brand hover:bg-brand/80"
            >
              Áp dụng
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <ChipGroup
            label="Loại thu nhập"
            options={INCOME_TYPE_FILTER_OPTIONS}
            value={draftIncomeType}
            onChange={setDraftIncomeType}
          />
          <ChipGroup
            label="Trạng thái"
            options={STATUS_FILTER_OPTIONS}
            value={draftStatus}
            onChange={setDraftStatus}
          />
        </div>
      </Modal>
    </div>
  );
};

export default PayrollTable;
