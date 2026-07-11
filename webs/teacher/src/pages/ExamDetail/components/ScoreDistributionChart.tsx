import DonutStatsCard from "_common/components/DonutStatsCard";

interface ScoreDistributionChartProps {
  buckets: [number, number, number, number];
  totalScore: number;
  loading?: boolean;
}

const COLORS = ["#f87171", "#fbbf24", "#38bdf8", "#34d399"];

/** Score buckets over the exam's 0..total_score range, split into 4 even bands. */
const ScoreDistributionChart = ({ buckets, totalScore, loading }: ScoreDistributionChartProps) => {
  const step = totalScore / 4 || 1;
  const total = buckets.reduce((s, v) => s + v, 0);

  return (
    <DonutStatsCard
      title="Phân bố điểm"
      centerValue={String(total)}
      centerCaption="Tổng lượt thi"
      loading={loading}
      legend={buckets.map((value, i) => ({
        key: i,
        label: `${Math.round(i * step)} - ${Math.round((i + 1) * step)}`,
        color: COLORS[i],
        value,
      }))}
    />
  );
};

export default ScoreDistributionChart;
