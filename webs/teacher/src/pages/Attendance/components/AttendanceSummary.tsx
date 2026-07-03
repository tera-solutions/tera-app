import {
  CheckCircleOutlined,
  ClockOutlined,
  UsersOutlined,
  XCircleOutlined,
} from "tera-dls";

import StatisticCard from "_common/components/StatisticCard";

import type { AttendanceSummaryCounts } from "../_interface";

interface AttendanceSummaryProps {
  counts: AttendanceSummaryCounts;
  loading?: boolean;
}

const AttendanceSummary = ({ counts, loading }: AttendanceSummaryProps) => (
  <div className="grid grid-cols-2 gap-4 xmd:grid-cols-4">
    <StatisticCard
      icon={<UsersOutlined />}
      value={counts.total}
      label="Tổng số HV"
      iconClassName="bg-sky-50 text-brand"
      loading={loading}
    />
    <StatisticCard
      icon={<CheckCircleOutlined />}
      value={counts.present}
      label="Có mặt"
      iconClassName="bg-emerald-50 text-emerald-500"
      loading={loading}
    />
    <StatisticCard
      icon={<ClockOutlined />}
      value={counts.late}
      label="Đi muộn"
      iconClassName="bg-amber-50 text-amber-500"
      loading={loading}
    />
    <StatisticCard
      icon={<XCircleOutlined />}
      value={counts.absent}
      label="Vắng mặt"
      iconClassName="bg-red-50 text-red-500"
      loading={loading}
    />
  </div>
);

export default AttendanceSummary;
