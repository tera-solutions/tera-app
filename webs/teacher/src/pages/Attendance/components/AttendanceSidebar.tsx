import { TextArea } from "tera-dls";

import Avatar from "_common/components/Avatar";
import Card from "_common/components/Card";
import DonutStatsCard from "_common/components/DonutStatsCard";
import { useMeta } from "_common/hooks/useMeta";

import type { AttendanceRow, AttendanceSummaryCounts } from "../_interface";

const ATTENDANCE_STATUS_META = "attendance_status";

interface AttendanceSidebarProps {
  counts: AttendanceSummaryCounts;
  absentRows: AttendanceRow[];
  note: string;
  onNoteChange: (value: string) => void;
}

const pct = (value: number, total: number) =>
  total === 0 ? 0 : Math.round((value / total) * 1000) / 10;

/** The donut's segments — deliberately a subset of `attendance_status` (excludes "excused"). */
const SEGMENTS: {
  key: string;
  metaValue: string;
  fallbackLabel: string;
  fallbackColor: string;
  value: (counts: AttendanceSummaryCounts) => number;
}[] = [
  { key: "present", metaValue: "present", fallbackLabel: "Có mặt", fallbackColor: "#10b981", value: (c) => c.present },
  { key: "late", metaValue: "late", fallbackLabel: "Đi muộn", fallbackColor: "#f59e0b", value: (c) => c.late },
  { key: "absent", metaValue: "absent", fallbackLabel: "Vắng mặt", fallbackColor: "#ef4444", value: (c) => c.absent },
];

const AttendanceSidebar = ({
  counts,
  absentRows,
  note,
  onNoteChange,
}: AttendanceSidebarProps) => {
  const { getItem } = useMeta();

  return (
    <div className="flex flex-col gap-4">
      <DonutStatsCard
        title="Thống kê chi tiết"
        centerValue={String(counts.total)}
        centerCaption="Tổng số"
        legend={SEGMENTS.map(({ key, metaValue, fallbackLabel, fallbackColor, value }) => {
          const meta = getItem(ATTENDANCE_STATUS_META, metaValue);
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

      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">
          Danh sách vắng mặt ({absentRows.length})
        </p>
        {absentRows.length === 0 ? (
          <p className="text-xs text-slate-400">Không có học viên vắng mặt</p>
        ) : (
          <div className="flex flex-col gap-2">
            {absentRows.map((row) => (
              <div key={row.student_id} className="flex items-center gap-2">
                <Avatar
                  src={row.avatar}
                  alt={row.name}
                  sizeClassName="h-7 w-7"
                  iconClassName="bg-red-50 text-red-500"
                  iconSizeClassName="[&_svg]:h-3.5 [&_svg]:w-3.5"
                  shrink={false}
                />
                <p className="truncate text-sm text-slate-700">{row.name}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">
          Ghi chú buổi học
        </p>
        <TextArea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Nhập ghi chú về buổi học..."
          rows={4}
          maxLength={500}
        />
      </Card>
    </div>
  );
};

export default AttendanceSidebar;
