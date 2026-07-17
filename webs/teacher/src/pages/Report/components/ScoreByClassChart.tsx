import ChartBar from "@tera/components/dof/Chart/ChartBar";
import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";

import type { ScoreByClassPoint } from "../_interface";

interface ScoreByClassChartProps {
  points: ScoreByClassPoint[];
  loading?: boolean;
}

const ScoreByClassChart = ({ points, loading }: ScoreByClassChartProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-700">Kết quả học tập theo lớp</p>
    <WidgetState isLoading={loading} isEmpty={!loading && points.length === 0} emptyText="Chưa có dữ liệu điểm">
      <div className="h-56">
        <ChartBar
          data={{
            labels: points.map((p) => p.className),
            datasets: [
              {
                label: "Điểm trung bình",
                data: points.map((p) => p.avgScore ?? 0),
                backgroundColor: "#38bdf8",
                borderRadius: 6,
                maxBarThickness: 36,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { max: 10, grid: { color: "rgba(148, 163, 184, 0.12)" } },
              x: { grid: { display: false } },
            },
          }}
        />
      </div>
    </WidgetState>
  </Card>
);

export default ScoreByClassChart;
