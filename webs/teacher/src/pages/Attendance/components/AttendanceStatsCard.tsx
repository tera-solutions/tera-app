import DonutStatsCard from "_common/components/DonutStatsCard";
import { useMeta } from "_common/hooks/useMeta";

import type { AttendanceSummaryCounts } from "../_interface";

const ATTENDANCE_STATUS_META = "attendance_status";

const pct = (value: number, total: number) =>
  total === 0 ? 0 : Math.round((value / total) * 1000) / 10;

/** Deliberately a subset of `attendance_status` (excludes "excused"), plus a
 * synthetic "unmarked" segment (not a real backend status) so the donut
 * accounts for every student instead of leaving an unexplained gap. Its color
 * matches the "Chưa điểm danh" badge used in AttendanceGrid/AttendanceTable
 * (`bg-slate-100 text-slate-400`). */
const SEGMENTS: {
  key: string;
  metaValue: string | null;
  fallbackLabel: string;
  fallbackColor: string;
  value: (counts: AttendanceSummaryCounts) => number;
}[] = [
  { key: "present", metaValue: "present", fallbackLabel: "Có mặt", fallbackColor: "#10b981", value: (c) => c.present },
  { key: "late", metaValue: "late", fallbackLabel: "Đi muộn", fallbackColor: "#f59e0b", value: (c) => c.late },
  { key: "absent", metaValue: "absent", fallbackLabel: "Vắng mặt", fallbackColor: "#ef4444", value: (c) => c.absent },
  { key: "unmarked", metaValue: null, fallbackLabel: "Chưa điểm danh", fallbackColor: "#94a3b8", value: (c) => Math.max(c.total - c.present - c.late - c.absent, 0) },
];

interface AttendanceStatsCardProps {
  counts: AttendanceSummaryCounts;
  loading?: boolean;
}

const AttendanceStatsCard = ({ counts, loading }: AttendanceStatsCardProps) => {
  const { getItem } = useMeta();

  return (
    <DonutStatsCard
      title="Thống kê"
      loading={loading}
      centerValue={String(counts.total)}
      centerCaption="Tổng số"
      legend={SEGMENTS.map(({ key, metaValue, fallbackLabel, fallbackColor, value }) => {
        const meta = metaValue ? getItem(ATTENDANCE_STATUS_META, metaValue) : undefined;
        const count = value(counts);
        return {
          key,
          label: meta?.label ?? fallbackLabel,
          color: meta?.color ?? fallbackColor,
          value: count,
          displayValue: `${count} (${pct(count, counts.total)}%)`,
        };
      })}
    />
  );
};

export default AttendanceStatsCard;
