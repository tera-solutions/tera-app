import classNames from "classnames";
import ChartLine from "@tera/components/dof/Chart/ChartLine";

import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";

import type { ChartPeriod, ProgressPoint } from "../_interface";

interface ProgressChartProps {
  points: ProgressPoint[];
  period: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
  loading?: boolean;
}

const PERIOD_OPTIONS: { key: ChartPeriod; label: string }[] = [
  { key: "week", label: "Tuần" },
  { key: "month", label: "Tháng" },
  { key: "year", label: "Năm" },
];

const ProgressChart = ({ points, period, onPeriodChange, loading }: ProgressChartProps) => (
  <Card>
    <div className="mb-3 flex items-center justify-between">
      <p className="text-sm font-semibold text-slate-700">Tiến trình</p>
      <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onPeriodChange(opt.key)}
            className={classNames(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              period === opt.key ? "bg-white text-brand shadow-sm" : "text-slate-500 hover:text-slate-700",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
    <WidgetState
      isLoading={loading}
      isEmpty={!loading && points.length === 0}
      emptyText="Chưa có dữ liệu tiến trình"
    >
      <div className="h-64">
        <ChartLine
          data={{
            labels: points.map((p) => p.label),
            datasets: [
              {
                label: "Số buổi dạy",
                data: points.map((p) => p.sessions),
                borderColor: "#38bdf8",
                backgroundColor: "#38bdf8",
                tension: 0.3,
              },
              {
                label: "Số học viên",
                data: points.map((p) => p.students),
                borderColor: "#34d399",
                backgroundColor: "#34d399",
                tension: 0.3,
              },
            ],
          }}
          options={{ maintainAspectRatio: false }}
        />
      </div>
    </WidgetState>
  </Card>
);

export default ProgressChart;
