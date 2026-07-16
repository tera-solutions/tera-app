import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "tera-dls";

import { DateRangeValue } from "_common/components/DateRangeFilter";
import { PATHS } from "_common/components/Layout/Menu/menus";

import IncomeChart from "./components/IncomeChart";
import PayrollSummary from "./components/PayrollSummary";
import PayrollTable from "./components/PayrollTable";
import PaymentSchedule from "./components/PaymentSchedule";
import SalaryOverview from "./components/SalaryOverview";
import type { PayrollPeriod } from "./_interface";
import {
  CURRENT_STATS,
  INCOME_TREND,
  PAYMENT_SCHEDULE,
  PAYROLL_PERIODS,
  RECENT_ACTIVITIES,
} from "./_mock";
import { parseDmy } from "./_utils";

// [054] Bảng lương — UI-only theo design `bang luong.png`. Data từ `_mock.ts`.

// Mặc định phủ toàn bộ data mock để bảng hiện đủ 20 kỳ; filter co lại khi đổi range.
const DEFAULT_RANGE: DateRangeValue = {
  from: parseDmy("01/01/2023") ?? new Date(2023, 0, 1),
  to: parseDmy("31/12/2025") ?? new Date(2025, 11, 31),
};

const Payroll = () => {
  const navigate = useNavigate();

  const [range, setRange] = useState<DateRangeValue>(DEFAULT_RANGE);
  const [incomeType, setIncomeType] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return PAYROLL_PERIODS.filter((p) => {
      const from = parseDmy(p.fromDate);
      const to = parseDmy(p.toDate);
      if (from && to && (to < range.from || from > range.to)) return false;
      if (incomeType && p.incomeType !== incomeType) return false;
      if (status && p.status !== status) return false;
      if (kw && !`${p.period} ${p.incomeType} ${p.fromDate} ${p.toDate}`.toLowerCase().includes(kw))
        return false;
      return true;
    });
  }, [range, incomeType, status, search]);

  const total = filtered.length;
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

  const resetPage = () => setPage(1);

  const handleView = (row: PayrollPeriod) => navigate(`${PATHS.payroll}/${row.id}`);
  const demo = () =>
    notification.warning({ message: "Tính năng đang được phát triển" });

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800">Bảng lương</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Theo dõi, quản lý và tổng hợp thu nhập của giáo viên.
        </p>
      </div>

      <div className="mb-4">
        <PayrollSummary stats={CURRENT_STATS} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start [&>*]:min-w-0">
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)] xmd:p-5">
            <PayrollTable
              rows={pageRows}
              total={total}
              page={page}
              perPage={perPage}
              onPageChange={(p, size) => {
                setPage(p);
                setPerPage(size);
              }}
              range={range}
              onRangeChange={(r) => {
                setRange(r);
                resetPage();
              }}
              incomeType={incomeType}
              onIncomeTypeChange={(v) => {
                setIncomeType(v);
                resetPage();
              }}
              status={status}
              onStatusChange={(v) => {
                setStatus(v);
                resetPage();
              }}
              search={search}
              onSearchChange={(v) => {
                setSearch(v);
                resetPage();
              }}
              onView={handleView}
              onExport={demo}
              onDownloadRow={demo}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
            <IncomeChart points={INCOME_TREND} />
            <PaymentSchedule rows={PAYMENT_SCHEDULE} />
          </div>
        </div>

        <SalaryOverview stats={CURRENT_STATS} activities={RECENT_ACTIVITIES} />
      </div>
    </div>
  );
};

export default Payroll;
