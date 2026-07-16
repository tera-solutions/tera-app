import ChartDoughnut from "@tera/components/dof/Chart/ChartDoughnut";
import {
  CheckCircleOutlined,
  DocumentTextOutlined,
  WalletOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

import type { ActivityItem, PayrollStats } from "../_interface";
import { formatVnd, pct } from "../_utils";

interface SalaryOverviewProps {
  stats: PayrollStats;
  activities: ActivityItem[];
}

const DONUT = [
  { key: "baseSalary", label: "Lương cơ bản", color: "#3b82f6" },
  { key: "bonus", label: "Thưởng", color: "#22c55e" },
  { key: "allowance", label: "Phụ cấp", color: "#f59e0b" },
  { key: "deduction", label: "Khấu trừ", color: "#ef4444" },
] as const;

const ACTIVITY_ICONS = [
  <DocumentTextOutlined key="0" />,
  <CheckCircleOutlined key="1" />,
  <WalletOutlined key="2" />,
];

const SalaryOverview = ({ stats, activities }: SalaryOverviewProps) => {
  // Design lấy % trên TỔNG THU NHẬP (kể cả khấu trừ) → 53.1/24.8/10.6/6.2%.
  const base = stats.grossIncome;

  const overviewRows: { label: string; value: number; valueClass?: string }[] = [
    { label: "Lương cơ bản", value: stats.baseSalary },
    { label: "Thưởng", value: stats.bonus },
    { label: "Phụ cấp", value: stats.allowance },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card className="xmd:p-5" animated={false}>
        <p className="mb-3 text-base font-semibold text-slate-800">
          Tổng quan thu nhập tháng {stats.monthLabel}
        </p>
        <div className="flex flex-col gap-2 text-sm">
          {overviewRows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-2">
              <span className="text-slate-500">{r.label}</span>
              <span className="font-medium text-slate-700">{formatVnd(r.value)}</span>
            </div>
          ))}
        </div>
        <div className="my-3 border-t border-dashed border-slate-200" />
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-600">Tổng thu nhập</span>
            <span className="font-semibold text-slate-800">{formatVnd(stats.grossIncome)}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-600">Khấu trừ</span>
            <span className="font-semibold text-rose-500">{formatVnd(stats.deduction)}</span>
          </div>
        </div>
        <div className="my-3 border-t border-dashed border-slate-200" />
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-slate-700">Thực nhận</span>
          <span className="text-lg font-bold text-brand">{formatVnd(stats.netIncome)}</span>
        </div>
      </Card>

      <Card className="xmd:p-5" animated={false}>
        <p className="mb-3 text-base font-semibold text-slate-800">
          Cơ cấu thu nhập tháng {stats.monthLabel}
        </p>
        <div className="flex items-center gap-4">
          <div className="h-28 w-28 shrink-0">
            <ChartDoughnut
              data={{
                labels: DONUT.map((d) => d.label),
                datasets: [
                  {
                    data: DONUT.map((d) => stats[d.key]),
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
                <span className="font-semibold text-slate-700">{pct(stats[d.key], base)}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="xmd:p-5" animated={false}>
        <p className="mb-3 text-base font-semibold text-slate-800">Hoạt động gần đây</p>
        <div className="flex flex-col gap-3">
          {activities.map((a, i) => (
            <div key={a.id} className="flex items-start gap-3">
              <IconBox
                icon={ACTIVITY_ICONS[i % ACTIVITY_ICONS.length]}
                sizeClassName="h-8 w-8"
                colorClassName="bg-sky-50 text-brand"
                iconSizeClassName="[&_svg]:h-4 [&_svg]:w-4"
              />
              <div className="min-w-0">
                <p className="text-sm text-slate-700">{a.title}</p>
                <p className="text-xs text-slate-400">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-4 w-full text-center text-sm font-medium text-brand transition-colors hover:text-brand/80"
        >
          Xem tất cả hoạt động
        </button>
      </Card>
    </div>
  );
};

export default SalaryOverview;
