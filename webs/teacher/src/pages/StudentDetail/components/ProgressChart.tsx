import { ChartLine } from "@tera/components/dof/Chart";
import moment from "moment";

interface ProgressPoint {
  date: string;
  score: number;
}

/** Evaluation score trend over time (evaluations are the only real, dated per-student score series available). */
const ProgressChart = ({ points }: { points: ProgressPoint[] }) => {
  if (points.length < 2) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">
        Chưa đủ dữ liệu đánh giá để hiển thị biểu đồ tiến độ
      </p>
    );
  }

  return (
    <ChartLine
      data={{
        labels: points.map((p) => moment(p.date).format("DD/MM")),
        datasets: [
          {
            label: "Điểm đánh giá",
            data: points.map((p) => p.score),
            borderColor: "#0284c7",
            backgroundColor: "rgba(2, 132, 199, 0.1)",
            tension: 0.35,
            fill: true,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { min: 0, max: 5, ticks: { stepSize: 1 } } },
      }}
    />
  );
};

export default ProgressChart;
