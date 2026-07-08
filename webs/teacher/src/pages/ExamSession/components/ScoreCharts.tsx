import ChartBar from "@tera/components/dof/Chart/ChartBar";
import ChartPie from "@tera/components/dof/Chart/ChartPie";

import Card from "_common/components/Card";

import type { ExamResultRow } from "../_interface";
import { scoreHistogram } from "../_utils";

interface ScoreChartsProps {
  rows: ExamResultRow[];
  totalScore: number;
  passRate: number;
}

const ScoreCharts = ({ rows, totalScore, passRate }: ScoreChartsProps) => {
  const step = totalScore / 4 || 1;
  const histogram = scoreHistogram(rows, totalScore);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">Phân bố điểm</p>
        <div className="h-56">
          <ChartBar
            data={{
              labels: [0, 1, 2, 3].map(
                (i) => `${Math.round(i * step)}-${Math.round((i + 1) * step)}`,
              ),
              datasets: [{ data: histogram, backgroundColor: "#38bdf8", borderRadius: 4 }],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { ticks: { stepSize: 1 } } },
            }}
          />
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">Tỷ lệ đạt / không đạt</p>
        <div className="h-56">
          <ChartPie
            data={{
              labels: ["Đạt", "Không đạt"],
              datasets: [
                {
                  data: [passRate, Math.max(100 - passRate, 0)],
                  backgroundColor: ["#34d399", "#f87171"],
                  borderWidth: 0,
                },
              ],
            }}
            options={{ maintainAspectRatio: false }}
          />
        </div>
      </Card>
    </div>
  );
};

export default ScoreCharts;
