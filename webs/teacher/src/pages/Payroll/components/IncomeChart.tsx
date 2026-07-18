import ChartLine from "@tera/components/dof/Chart/ChartLine";

import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";

import type { PayrollRow } from "../_interface";
import { formatVnd, periodLabel } from "../_utils";

interface IncomeChartProps {
  rows: PayrollRow[];
  loading?: boolean;
}

// 11300000 → "11.3M"
const toMillionLabel = (value: number) => {
  const m = value / 1_000_000;
  return `${Number.isInteger(m) ? m : m.toFixed(1)}M`;
};

/** Xu hướng thực lãnh theo kỳ — dựng trực tiếp từ danh sách đã tải (cũ → mới), không
 * cần endpoint riêng. */
const IncomeChart = ({ rows, loading }: IncomeChartProps) => {
  const points = [...rows].reverse();

  return (
    <Card className="xmd:p-5" animated={false}>
      <p className="mb-3 text-base font-semibold text-slate-800">Xu hướng thực lãnh</p>
      <WidgetState isLoading={loading} isEmpty={!loading && points.length === 0} emptyText="Chưa có dữ liệu">
        <div className="h-56">
          <ChartLine
            plugins={["data-labels"]}
            data={{
              labels: points.map((p) => periodLabel(p.month, p.year)),
              datasets: [
                {
                  label: "Thực lãnh (đồng)",
                  data: points.map((p) => p.totalSalary),
                  borderColor: "#38bdf8",
                  pointBackgroundColor: "#38bdf8",
                  pointRadius: 4,
                  fill: false,
                  tension: 0.35,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              layout: { padding: { top: 22 } },
              plugins: {
                legend: { display: true, position: "bottom" as const },
                tooltip: {
                  callbacks: { label: (ctx: any) => formatVnd(points[ctx.dataIndex]?.totalSalary ?? 0) },
                },
                datalabels: {
                  anchor: "end",
                  align: "top",
                  offset: 4,
                  clamp: true,
                  color: "#334155",
                  font: { size: 11, weight: 600 },
                  formatter: (_v: number, ctx: any) => toMillionLabel(points[ctx.dataIndex]?.totalSalary ?? 0),
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grace: "20%",
                  ticks: { callback: (value: number) => toMillionLabel(Number(value)) },
                  grid: { color: "rgba(148, 163, 184, 0.12)" },
                },
                x: { offset: true, grid: { display: false } },
              },
            }}
          />
        </div>
      </WidgetState>
    </Card>
  );
};

export default IncomeChart;
