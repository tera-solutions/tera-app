import moment from "moment";

import ChartLine from "@tera/components/dof/Chart/ChartLine";
import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";

import type { WeeklySessionPoint } from "../_interface";

interface ActivityOverTimeChartProps {
  points: WeeklySessionPoint[];
  loading?: boolean;
}

const ActivityOverTimeChart = ({ points, loading }: ActivityOverTimeChartProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-700">Báo cáo theo thời gian</p>
    <WidgetState isLoading={loading} isEmpty={!loading && points.length === 0} emptyText="Chưa có dữ liệu buổi dạy">
      <div className="h-56">
        <ChartLine
          data={{
            labels: points.map((p) => moment(p.weekStart).format("DD/MM")),
            datasets: [
              {
                label: "Hoạt động giảng dạy",
                data: points.map((p) => p.totalSessions),
                borderColor: "#38bdf8",
                backgroundColor: "rgba(56, 189, 248, 0.12)",
                pointBackgroundColor: "#38bdf8",
                pointRadius: 2.5,
                fill: true,
                tension: 0.35,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: "rgba(148, 163, 184, 0.12)" } },
              x: { grid: { display: false } },
            },
          }}
        />
      </div>
    </WidgetState>
  </Card>
);

export default ActivityOverTimeChart;
