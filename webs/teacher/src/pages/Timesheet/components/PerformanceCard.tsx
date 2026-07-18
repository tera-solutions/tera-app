import { ClipboardDocumentCheckOutlined, StarOutlined } from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

import type { TimesheetSummary } from "../_interface";

interface PerformanceCardProps {
  summary: TimesheetSummary;
}

const Bar = ({ value, color }: { value: number; color: string }) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
    <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
  </div>
);

/** "Hiệu suất giảng dạy" — tỷ lệ chuyên cần + đánh giá trung bình, cả hai đều tính
 * từ dữ liệu điểm danh/feedback thật (`v1/hr/timesheet/summary`). */
const PerformanceCard = ({ summary }: PerformanceCardProps) => {
  const attendanceRate = summary.attendanceRate ?? 0;
  const ratingPercent = summary.averageRating !== null ? (summary.averageRating / 5) * 100 : 0;

  return (
    <Card className="xmd:p-5" animated={false}>
      <p className="mb-4 text-base font-semibold text-slate-800">Hiệu suất giảng dạy</p>

      <div className="flex items-center gap-3">
        <IconBox icon={<ClipboardDocumentCheckOutlined />} colorClassName="bg-emerald-50 text-emerald-500" />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-slate-500">Tỷ lệ chuyên cần</span>
            <span className="font-semibold text-slate-700">
              {summary.attendanceRate === null ? "—" : `${summary.attendanceRate}%`}
            </span>
          </div>
          <Bar value={attendanceRate} color="bg-emerald-400" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <IconBox icon={<StarOutlined />} colorClassName="bg-amber-50 text-amber-500" />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-slate-500">Đánh giá trung bình</span>
            <span className="font-semibold text-slate-700">
              {summary.averageRating === null ? "—" : `${summary.averageRating}/5`}
            </span>
          </div>
          <Bar value={ratingPercent} color="bg-amber-400" />
        </div>
      </div>
    </Card>
  );
};

export default PerformanceCard;
