import ChartLine from "@tera/components/dof/Chart/ChartLine";

import Card from "_common/components/Card";

import type { IncomePoint } from "../_interface";
import { formatVnd } from "../_utils";

interface IncomeChartProps {
  points: IncomePoint[];
}

// 11300000 → "11.3M"
const toMillionLabel = (value: number) => {
  const m = value / 1_000_000;
  return `${Number.isInteger(m) ? m : m.toFixed(1)}M`;
};

const IncomeChart = ({ points }: IncomeChartProps) => (
  <Card className="xmd:p-5" animated={false}>
    <p className="mb-3 text-base font-semibold text-slate-800">Biểu đồ thu nhập 6 tháng gần nhất</p>
    <div className="h-56">
      <ChartLine
        plugins={["data-labels"]}
        data={{
          labels: points.map((p) => p.label),
          datasets: [
            {
              label: "Tổng thu nhập (đồng)",
              data: points.map((p) => p.amount),
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
              callbacks: { label: (ctx: any) => formatVnd(points[ctx.dataIndex]?.amount ?? 0) },
            },
            datalabels: {
              anchor: "end",
              align: "top",
              offset: 4,
              clamp: true,
              color: "#334155",
              font: { size: 11, weight: 600 },
              formatter: (_v: number, ctx: any) => toMillionLabel(points[ctx.dataIndex]?.amount ?? 0),
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
  </Card>
);

export default IncomeChart;
