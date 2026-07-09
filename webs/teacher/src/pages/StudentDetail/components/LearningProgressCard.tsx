import type { StudentStats } from "../_interface";

interface LearningProgressCardProps {
  stats: StudentStats;
  loading?: boolean;
}

const ProgressBar = ({
  label,
  value,
  colorClassName,
}: {
  label: string;
  value: number;
  colorClassName: string;
}) => (
  <div>
    <div className="mb-1 flex items-center justify-between text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-700">{value}%</span>
    </div>
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${colorClassName}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  </div>
);

const LearningProgressCard = ({ stats, loading }: LearningProgressCardProps) => {
  if (loading) {
    return <p className="py-8 text-center text-sm text-slate-400">Đang tải tiến độ học tập...</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <ProgressBar label="Điểm danh" value={stats.attendance_rate} colorClassName="bg-sky-400" />
      <ProgressBar label="Hoàn thành bài tập" value={stats.assignment_completion} colorClassName="bg-emerald-400" />
      {stats.avg_score != null && (
        <ProgressBar
          label="Điểm trung bình"
          value={Math.round(stats.avg_score)}
          colorClassName="bg-amber-400"
        />
      )}
    </div>
  );
};

export default LearningProgressCard;
