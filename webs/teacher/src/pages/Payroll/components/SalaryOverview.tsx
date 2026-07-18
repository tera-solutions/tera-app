import ChartDoughnut from "@tera/components/dof/Chart/ChartDoughnut";

import Card from "_common/components/Card";

import type { PayrollRow } from "../_interface";
import { formatVnd, pct, periodLabel } from "../_utils";

interface SalaryOverviewProps {
  latest: PayrollRow | null;
}

const DONUT = [
  { key: "baseSalary", label: "Lương cơ bản", color: "#3b82f6" },
  { key: "bonus", label: "Thưởng", color: "#22c55e" },
  { key: "penalty", label: "Phạt", color: "#ef4444" },
] as const;

/** "Tổng quan thu nhập" kỳ gần nhất — chỉ 3 thành phần thật: lương cơ bản
 * (giờ dạy × đơn giá), thưởng, phạt. Không có bảo hiểm/thuế/phụ cấp (BE không có). */
const SalaryOverview = ({ latest }: SalaryOverviewProps) => {
  if (!latest) {
    return (
      <Card className="xmd:p-5" animated={false}>
        <p className="text-sm text-slate-400">Chưa có kỳ lương nào để hiển thị tổng quan.</p>
      </Card>
    );
  }

  const base = latest.baseSalary + latest.bonus + latest.penalty;

  return (
    <div className="flex flex-col gap-4">
      <Card className="xmd:p-5" animated={false}>
        <p className="mb-3 text-base font-semibold text-slate-800">
          Tổng quan thu nhập tháng {periodLabel(latest.month, latest.year)}
        </p>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500">Giờ dạy</span>
            <span className="font-medium text-slate-700">{latest.totalHours}h</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500">Lương cơ bản</span>
            <span className="font-medium text-slate-700">{formatVnd(latest.baseSalary)}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500">Thưởng</span>
            <span className="font-medium text-slate-700">{formatVnd(latest.bonus)}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500">Phạt</span>
            <span className="font-medium text-rose-500">-{formatVnd(latest.penalty)}</span>
          </div>
        </div>
        <div className="my-3 border-t border-dashed border-slate-200" />
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-slate-700">Thực lãnh</span>
          <span className="text-lg font-bold text-brand">{formatVnd(latest.totalSalary)}</span>
        </div>
      </Card>

      <Card className="xmd:p-5" animated={false}>
        <p className="mb-3 text-base font-semibold text-slate-800">
          Cơ cấu thu nhập tháng {periodLabel(latest.month, latest.year)}
        </p>
        <div className="flex items-center gap-4">
          <div className="h-28 w-28 shrink-0">
            <ChartDoughnut
              data={{
                labels: DONUT.map((d) => d.label),
                datasets: [
                  {
                    data: DONUT.map((d) => latest[d.key]),
                    backgroundColor: DONUT.map((d) => d.color),
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
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {DONUT.map((d) => (
              <div key={d.key} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 text-slate-500">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.label}
                </span>
                <span className="font-semibold text-slate-700">{pct(latest[d.key], base)}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SalaryOverview;
