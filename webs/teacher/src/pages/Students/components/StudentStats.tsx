import {
  AcademicCapOutlined,
  ExclamationTriangleOutlined,
  TrophyOutlined,
  UsersOutlined,
  XCircleOutlined,
} from "tera-dls";

import StatisticCard from "_common/components/StatisticCard";

import type { StudentSummary } from "../_interface";

interface StudentStatsProps {
  summary: StudentSummary;
  loading?: boolean;
}

const StudentStats = ({ summary, loading }: StudentStatsProps) => (
  <div className="grid grid-cols-2 gap-4 xmd:grid-cols-3 xl:grid-cols-5">
    <StatisticCard
      icon={<UsersOutlined />}
      value={summary.total}
      label="Tổng học viên"
      iconClassName="bg-sky-50 text-brand"
      loading={loading}
    />
    <StatisticCard
      icon={<AcademicCapOutlined />}
      value={summary.active}
      label="Đang học"
      iconClassName="bg-emerald-50 text-emerald-500"
      loading={loading}
    />
    <StatisticCard
      icon={<ExclamationTriangleOutlined />}
      value={summary.debt}
      label="Nợ học phí"
      iconClassName="bg-rose-50 text-rose-600"
      loading={loading}
    />
    <StatisticCard
      icon={<XCircleOutlined />}
      value={summary.dropped}
      label="Đã nghỉ"
      iconClassName="bg-red-50 text-red-500"
      loading={loading}
    />
    <StatisticCard
      icon={<TrophyOutlined />}
      value={summary.completed}
      label="Hoàn thành"
      iconClassName="bg-violet-50 text-violet-500"
      loading={loading}
    />
  </div>
);

export default StudentStats;
