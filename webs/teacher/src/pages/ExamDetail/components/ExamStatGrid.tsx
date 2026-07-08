import {
  CalendarDaysOutlined,
  ChartBarOutlined,
  CheckBadgeOutlined,
  StarOutlined,
  UsersOutlined,
  XCircleOutlined,
} from "tera-dls";

import StatisticCard from "_common/components/StatisticCard";

interface ExamStatGridProps {
  totalStudents: number;
  daysAgo: number;
  avgScore: number;
  maxScore: number;
  passRate: number;
  failRate: number;
  loading?: boolean;
}

const ExamStatGrid = ({
  totalStudents,
  daysAgo,
  avgScore,
  maxScore,
  passRate,
  failRate,
  loading,
}: ExamStatGridProps) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
    <StatisticCard icon={<UsersOutlined />} value={totalStudents} label="Số HV" iconClassName="bg-sky-50 text-brand" loading={loading} />
    <StatisticCard icon={<CalendarDaysOutlined />} value={daysAgo} label="Ngày" iconClassName="bg-slate-100 text-slate-500" loading={loading} />
    <StatisticCard icon={<ChartBarOutlined />} value={avgScore || "—"} label="Điểm TB" iconClassName="bg-violet-50 text-violet-500" loading={loading} />
    <StatisticCard icon={<StarOutlined />} value={maxScore || "—"} label="Điểm cao nhất" iconClassName="bg-amber-50 text-amber-500" loading={loading} />
    <StatisticCard icon={<CheckBadgeOutlined />} value={`${passRate}%`} label="Tỷ lệ đạt" iconClassName="bg-emerald-50 text-emerald-500" loading={loading} />
    <StatisticCard icon={<XCircleOutlined />} value={`${failRate}%`} label="Tỷ lệ rớt" iconClassName="bg-red-50 text-red-500" loading={loading} />
  </div>
);

export default ExamStatGrid;
