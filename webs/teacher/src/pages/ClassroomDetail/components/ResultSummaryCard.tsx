import { CARD } from "_common/constants/dashboard";
import ProgressDonut from "pages/Classroom/components/ProgressDonut";

import type { ClassStatistics } from "../_interface";

interface ResultSummaryCardProps {
  statistics: ClassStatistics;
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-1.5 text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-semibold text-slate-700">{value}</span>
  </div>
);

const ResultSummaryCard = ({ statistics }: ResultSummaryCardProps) => {
  const { operational } = statistics;

  return (
    <div className={`${CARD} p-4`}>
      <p className="mb-3 text-sm font-semibold text-slate-700">
        Tổng quan kết quả học tập
      </p>

      <div className="flex items-center gap-4">
        <ProgressDonut
          value={operational.completion_rate}
          size={72}
          label="Tiến độ"
        />
        <div className="flex-1">
          <Row
            label="Buổi đã hoàn thành"
            value={`${operational.completed_sessions}/${operational.total_sessions}`}
          />
          <Row
            label="Buổi còn lại"
            value={String(operational.pending_sessions)}
          />
          <Row
            label="Tỷ lệ điểm danh TB"
            value={`${operational.avg_attendance_rate}%`}
          />
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-dashed border-slate-200 p-3 text-center">
        <p className="text-xs text-slate-400">
          Phân bố điểm số &amp; điểm trung bình lớp sẽ sớm khả dụng.
        </p>
      </div>
    </div>
  );
};

export default ResultSummaryCard;
