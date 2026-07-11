import { CheckBadgeOutlined, ClipboardDocumentCheckOutlined, DocumentTextOutlined } from "tera-dls";

import StatisticCard from "_common/components/StatisticCard";

import type { ParentChildStats } from "../_interface";

const ChildStatSidebar = ({ stats, loading }: { stats: ParentChildStats; loading?: boolean }) => (
  <div className="grid grid-cols-1 gap-3">
    <StatisticCard
      icon={<ClipboardDocumentCheckOutlined />}
      value={`${stats.attendance_rate}%`}
      label="Chuyên cần"
      iconClassName="bg-sky-50 text-brand"
      loading={loading}
    />
    <StatisticCard
      icon={<CheckBadgeOutlined />}
      value={stats.avg_score ?? "—"}
      label="Điểm trung bình"
      iconClassName="bg-emerald-50 text-emerald-500"
      loading={loading}
    />
    <StatisticCard
      icon={<DocumentTextOutlined />}
      value={`${stats.assignment_completion}%`}
      label="Bài tập hoàn thành"
      iconClassName="bg-violet-50 text-violet-500"
      loading={loading}
    />
  </div>
);

export default ChildStatSidebar;
