import { AcademicCapOutlined, CheckCircleOutlined, StarOutlined } from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

import type { TimesheetStats } from "../_interface";
import { pct } from "../_utils";

interface PerformanceCardProps {
  stats: TimesheetStats;
}

const Bar = ({ value, color }: { value: number; color: string }) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
    <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
  </div>
);

/**
 * "Hiệu suất giảng dạy". Chỉ **Tỷ lệ hoàn thành** có dữ liệu thật (từ trạng thái buổi);
 * Tỷ lệ HV tham gia (cần điểm danh) và Đánh giá TB (cần đánh giá) để "Sắp có".
 */
const PerformanceCard = ({ stats }: PerformanceCardProps) => {
  const completionRate = pct(stats.completed, stats.total);

  return (
    <Card className="xmd:p-5" animated={false}>
      <p className="mb-4 text-base font-semibold text-slate-800">Hiệu suất giảng dạy</p>

      <div className="flex items-center gap-3">
        <IconBox icon={<CheckCircleOutlined />} colorClassName="bg-emerald-50 text-emerald-500" />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-slate-500">Tỷ lệ hoàn thành</span>
            <span className="font-semibold text-slate-700">{completionRate}%</span>
          </div>
          <Bar value={completionRate} color="bg-emerald-400" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 opacity-60">
        <IconBox icon={<AcademicCapOutlined />} colorClassName="bg-sky-50 text-sky-500" />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-slate-500">Tỷ lệ học viên tham gia</span>
            <span className="text-xs italic text-slate-300">Sắp có</span>
          </div>
          <Bar value={0} color="bg-sky-400" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 opacity-60">
        <IconBox icon={<StarOutlined />} colorClassName="bg-amber-50 text-amber-500" />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-slate-500">Đánh giá trung bình</span>
            <span className="text-xs italic text-slate-300">Sắp có</span>
          </div>
          <Bar value={0} color="bg-amber-400" />
        </div>
      </div>
    </Card>
  );
};

export default PerformanceCard;
