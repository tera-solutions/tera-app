import ChartLine from "@tera/components/dof/Chart/ChartLine";
import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";

import type { WeekBucket } from "../_interface";
import { formatDuration } from "../_utils";

interface WeeklyHoursChartProps {
  buckets: WeekBucket[];
  loading?: boolean;
}

const WeeklyHoursChart = ({ buckets, loading }: WeeklyHoursChartProps) => {
  const isEmpty = buckets.every((b) => b.hours === 0);

  return (
    <Card className="xmd:p-5" animated={false}>
      <p className="mb-3 text-base font-semibold text-slate-800">Giờ giảng theo tuần</p>
      <WidgetState
        isLoading={loading}
        isEmpty={!loading && isEmpty}
        emptyText="Chưa có giờ giảng trong khoảng thời gian này"
      >
        <div className="h-56">
          <ChartLine
            plugins={["data-labels"]}
            data={{
              // Nhãn 2 dòng: "Tuần N" ở trên, khoảng ngày ở dưới (mảng = xuống dòng).
              labels: buckets.map((b) => [b.label, b.dateLabel]),
              datasets: [
                {
                  label: "Giờ giảng",
                  data: buckets.map((b) => b.hours),
                  borderColor: "#38bdf8",
                  pointBackgroundColor: "#38bdf8",
                  pointRadius: 3,
                  fill: false,
                  tension: 0.35,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              // Chừa khoảng trên để nhãn giá trị của điểm cao nhất không bị cắt.
              layout: { padding: { top: 20 } },
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (ctx) => formatDuration(buckets[ctx.dataIndex]?.hours ?? 0),
                  },
                },
                // Nhãn giá trị hiển thị PHÍA TRÊN mỗi điểm (giống ảnh thiết kế).
                datalabels: {
                  display: (ctx) => (buckets[ctx.dataIndex]?.hours ?? 0) > 0,
                  anchor: "end",
                  align: "top",
                  offset: 4,
                  clamp: true,
                  color: "#334155",
                  font: { size: 11, weight: 600 },
                  formatter: (_v, ctx) =>
                    formatDuration(buckets[ctx.dataIndex]?.hours ?? 0),
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  // Tự co theo dữ liệu, bước 5h; grace chừa headroom để nhãn điểm cao nhất không bị cắt.
                  grace: "20%",
                  ticks: { stepSize: 5, callback: (value) => `${value}h` },
                  grid: { color: "rgba(148, 163, 184, 0.12)" },
                },
                // offset: true → thêm padding hai đầu để điểm/nhãn Tuần 1 không dính sát trục Y
                // và Tuần cuối không sát mép phải (giống ảnh thiết kế).
                x: { offset: true, grid: { display: false } },
              },
            }}
          />
        </div>
      </WidgetState>
    </Card>
  );
};

export default WeeklyHoursChart;
