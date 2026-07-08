import ChartBar from "@tera/components/dof/Chart/ChartBar";

import Card from "_common/components/Card";

interface ScoreHistogramProps {
  buckets: [number, number, number, number];
}

const ScoreHistogram = ({ buckets }: ScoreHistogramProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-700">Thống kê điểm</p>
    <div className="h-48">
      <ChartBar
        data={{
          labels: ["0-2.5", "2.5-5", "5-7.5", "7.5-10"],
          datasets: [{ data: buckets, backgroundColor: "#38bdf8", borderRadius: 4 }],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { ticks: { stepSize: 1 } } },
        }}
      />
    </div>
  </Card>
);

export default ScoreHistogram;
