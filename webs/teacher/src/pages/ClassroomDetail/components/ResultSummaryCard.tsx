import DonutStatsCard from "_common/components/DonutStatsCard";

import type { ClassStatistics } from "../_interface";

interface ResultSummaryCardProps {
  statistics: ClassStatistics;
}

const ResultSummaryCard = ({ statistics }: ResultSummaryCardProps) => {
  const { operational } = statistics;

  return (
    <DonutStatsCard
      title="Tổng quan kết quả học tập"
      centerValue={`${operational.completion_rate}%`}
      centerCaption="Tiến độ"
      legend={[
        {
          key: "completed",
          label: "Buổi đã hoàn thành",
          color: "#10b981",
          value: operational.completed_sessions,
          displayValue: `${operational.completed_sessions}/${operational.total_sessions}`,
        },
        {
          key: "pending",
          label: "Buổi còn lại",
          color: "#cbd5e1",
          value: operational.pending_sessions,
        },
      ]}
      footer={
        <>
          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
            <span className="text-slate-500">Tỷ lệ điểm danh TB</span>
            <span className="font-semibold text-slate-700">
              {operational.avg_attendance_rate}%
            </span>
          </div>
          <div className="mt-3 rounded-xl border border-dashed border-slate-200 p-3 text-center">
            <p className="text-xs text-slate-400">
              Phân bố điểm số &amp; điểm trung bình lớp sẽ sớm khả dụng.
            </p>
          </div>
        </>
      }
    />
  );
};

export default ResultSummaryCard;
