import { useNavigate, useParams } from "react-router-dom";
import ChartDoughnut from "@tera/components/dof/Chart/ChartDoughnut";
import { ArrowLeftOutlined, Button, PrinterOutlined } from "tera-dls";

import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { PayrollService } from "@tera/modules/hr";

import ClassIncomeTable from "./components/ClassIncomeTable";
import { amountToWords, formatVnd, periodLabel, pct, toPayrollDetail } from "./_utils";

/** [055] Chi tiết bảng lương — `v1/hr/payroll/detail/{id}`. Chỉ hiển thị các trường
 * thật: giờ dạy, lương cơ bản, thưởng, phạt, thực lãnh + chi tiết theo lớp học.
 * Không có bảo hiểm/thuế/phụ cấp/lịch sử chuyển khoản (backend không có). */
const PayrollDetailPage = () => {
  const navigate = useNavigate();
  const { id = "" } = useParams();

  const query = PayrollService.usePayrollDetail({ id });
  const detail = toPayrollDetail(query.data);

  const classIncomeTotal = detail?.classIncome.reduce((a, c) => a + c.total, 0) ?? 0;

  return (
    <div className="p-4 xmd:p-6 print:p-0">
      <button
        type="button"
        onClick={() => navigate(PATHS.payroll)}
        className="mb-3 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-brand print:hidden"
      >
        <ArrowLeftOutlined className="h-4 w-4" />
        Quay lại bảng lương
      </button>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Chi tiết bảng lương</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            {detail ? `Kỳ lương tháng ${periodLabel(detail.payroll.month, detail.payroll.year)}` : "Đang tải..."}
          </p>
        </div>
        <Button
          icon={<PrinterOutlined />}
          onClick={() => window.print()}
          disabled={!detail}
          className="whitespace-nowrap bg-brand hover:bg-brand/80 print:hidden"
        >
          In bảng lương
        </Button>
      </div>

      <WidgetState isLoading={query.isLoading} isError={query.isError} onRetry={() => query.refetch()}>
        {detail && (
          <>
            <Card animated={false} className="mb-4 xmd:p-5">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr_1fr]">
                <div className="flex gap-4">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-semibold text-brand">
                    {detail.teacherName.trim().charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-slate-800">{detail.teacherName}</p>
                    <p className="text-sm text-slate-400">{detail.teacherCode}</p>
                    <p className="mt-1.5 text-xs text-slate-500">
                      Đơn giá/giờ: {formatVnd(detail.hourlyRate)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-2 text-sm lg:border-l lg:border-slate-100 lg:pl-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">Kỳ lương</span>
                    <span className="font-semibold text-slate-700">
                      {periodLabel(detail.payroll.month, detail.payroll.year)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">Giờ dạy</span>
                    <span className="text-slate-600">{detail.payroll.totalHours}h</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-brand to-blue-500 p-5 text-white">
                  <p className="text-sm text-white/80">Thực lãnh</p>
                  <p className="mt-1 text-3xl font-bold">{formatVnd(detail.payroll.totalSalary)}</p>
                  <p className="mt-1 text-xs italic text-white/80">
                    ({amountToWords(detail.payroll.totalSalary)})
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start [&>*]:min-w-0">
              <ClassIncomeTable rows={detail.classIncome} total={classIncomeTotal} />

              <Card className="xmd:p-5" animated={false}>
                <p className="mb-3 text-base font-semibold text-slate-800">Cơ cấu thu nhập</p>
                <div className="flex items-center gap-4">
                  <div className="h-28 w-28 shrink-0">
                    <ChartDoughnut
                      data={{
                        labels: ["Lương cơ bản", "Thưởng", "Phạt"],
                        datasets: [
                          {
                            data: [detail.payroll.baseSalary, detail.payroll.bonus, detail.payroll.penalty],
                            backgroundColor: ["#3b82f6", "#22c55e", "#ef4444"],
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false,
                        cutout: "68%",
                        plugins: { legend: { display: false }, datalabels: { display: false } },
                      }}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
                    {[
                      { label: "Lương cơ bản", value: detail.payroll.baseSalary, color: "bg-blue-500" },
                      { label: "Thưởng", value: detail.payroll.bonus, color: "bg-emerald-500" },
                      { label: "Phạt", value: detail.payroll.penalty, color: "bg-rose-500" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-slate-500">
                          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${row.color}`} />
                          {row.label}
                        </span>
                        <span className="font-semibold text-slate-700">
                          {pct(row.value, detail.payroll.baseSalary + detail.payroll.bonus + detail.payroll.penalty)}%
                        </span>
                      </div>
                    ))}
                    <div className="mt-1 flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                      <span className="font-semibold text-slate-700">Thực lãnh</span>
                      <span className="font-bold text-brand">{formatVnd(detail.payroll.totalSalary)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </WidgetState>
    </div>
  );
};

export default PayrollDetailPage;
