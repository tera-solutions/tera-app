import { TextArea } from "tera-dls";

import Avatar from "_common/components/Avatar";
import Card from "_common/components/Card";
import DonutStatsCard from "_common/components/DonutStatsCard";

import type { AttendanceRow, AttendanceSummaryCounts } from "../_interface";

interface AttendanceSidebarProps {
  counts: AttendanceSummaryCounts;
  absentRows: AttendanceRow[];
  note: string;
  onNoteChange: (value: string) => void;
}

const pct = (value: number, total: number) =>
  total === 0 ? 0 : Math.round((value / total) * 1000) / 10;

const CHART_COLORS = {
  present: "#10b981",
  late: "#f59e0b",
  absent: "#ef4444",
};

const AttendanceSidebar = ({
  counts,
  absentRows,
  note,
  onNoteChange,
}: AttendanceSidebarProps) => (
  <div className="flex flex-col gap-4">
    <DonutStatsCard
      title="Thống kê chi tiết"
      centerValue={String(counts.total)}
      centerCaption="Tổng số"
      legend={[
        {
          key: "present",
          label: "Có mặt",
          color: CHART_COLORS.present,
          value: counts.present,
          displayValue: `${counts.present} (${pct(counts.present, counts.total)}%)`,
        },
        {
          key: "late",
          label: "Đi muộn",
          color: CHART_COLORS.late,
          value: counts.late,
          displayValue: `${counts.late} (${pct(counts.late, counts.total)}%)`,
        },
        {
          key: "absent",
          label: "Vắng mặt",
          color: CHART_COLORS.absent,
          value: counts.absent,
          displayValue: `${counts.absent} (${pct(counts.absent, counts.total)}%)`,
        },
      ]}
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

export default AttendanceSidebar;
