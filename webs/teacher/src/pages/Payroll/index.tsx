import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PATHS } from "_common/components/Layout/Menu/menus";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { PayrollService } from "@tera/modules/hr";

import IncomeChart from "./components/IncomeChart";
import PayrollSummary from "./components/PayrollSummary";
import PayrollTable from "./components/PayrollTable";
import SalaryOverview from "./components/SalaryOverview";
import type { PayrollRow } from "./_interface";
import { exportPayrollCsv } from "./_export";
import { toPayrollRows } from "./_utils";

/** [054] Bảng lương — `v1/hr/payroll/*`. Lương = giờ dạy thực tế × đơn giá/giờ +
 * thưởng − phạt; không có bảo hiểm/thuế/phụ cấp (backend không có các khái niệm này).
 * BE tự backfill mọi tháng đã dạy qua `PayrollService::ensureGenerated()` mỗi khi
 * gọi list() — trang này chỉ đọc/hiển thị, không có hành động "Tính lương" thủ công. */
const Payroll = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);

  const listParams: Record<string, unknown> = { page, per_page: perPage };
  const listQuery = PayrollService.usePayrollList({ params: listParams });
  const rows = useMemo(() => toPayrollRows(listQuery.data), [listQuery.data]);
  const total = listQuery.data?.data?.pagination?.total ?? rows.length;

  // Kỳ gần nhất cho các card tổng quan — trang hiện tại đã sort mới→cũ theo mặc định của BE.
  const latest = rows[0] ?? null;

  const handleView = (row: PayrollRow) => navigate(`${PATHS.payroll}/${row.id}`);

  return (
    <div className='p-4 xmd:p-6'>
      <div className='mb-4'>
        <h1 className='text-xl font-bold text-slate-800'>Bảng lương</h1>
        <p className='mt-0.5 text-sm text-slate-400'>
          Theo dõi và tổng hợp thu nhập theo giờ dạy của bạn.
        </p>
      </div>

      <div className='mb-4'>
        <PayrollSummary latest={latest} loading={listQuery.isLoading} />
      </div>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start [&>*]:min-w-0'>
        <div className='flex flex-col gap-4'>
          <div className='rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)] xmd:p-5'>
            <PayrollTable
              rows={rows}
              total={total}
              page={page}
              perPage={perPage}
              loading={listQuery.isLoading}
              isError={listQuery.isError}
              onRetry={() => listQuery.refetch()}
              onPageChange={(p, size) => {
                setPage(size !== perPage ? 1 : p);
                setPerPage(size);
              }}
              onView={handleView}
              onExport={() => exportPayrollCsv(rows)}
            />
          </div>

          <IncomeChart rows={rows} loading={listQuery.isLoading} />
        </div>

        <SalaryOverview latest={latest} />
      </div>
    </div>
  );
};

export default Payroll;
