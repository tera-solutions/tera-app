import DonutStatsCard from "_common/components/DonutStatsCard";
import { useMeta } from "_common/hooks/useMeta";

import type { ClassStatistics } from "../_interface";

const SESSION_STATUS_META = "class_session_status";
const EXAM_GRADE_META = "exam_result_grade";

const GRADE_FALLBACK: Record<string, { label: string; color: string }> = {
  excellent: { label: "Xuất sắc", color: "#10b981" },
  good: { label: "Giỏi", color: "#38bdf8" },
  pass: { label: "Đạt", color: "#f59e0b" },
  fail: { label: "Chưa đạt", color: "#ef4444" },
};

interface ResultSummaryCardProps {
  statistics: ClassStatistics;
}

const ResultSummaryCard = ({ statistics }: ResultSummaryCardProps) => {
  const { operational } = statistics;
  const { getItem } = useMeta();

  const totalGraded = operational.score_distribution.reduce((sum, g) => sum + g.count, 0);

  return (
    <DonutStatsCard
      title="Tổng quan kết quả học tập"
      centerValue={`${operational.completion_rate}%`}
      centerCaption="Tiến độ"
      legend={[
        {
          key: "completed",
          label: "Buổi đã hoàn thành",
          color: getItem(SESSION_STATUS_META, "completed")?.color ?? "#10b981",
          value: operational.completed_sessions,
          displayValue: `${operational.completed_sessions}/${operational.total_sessions}`,
        },
        {
          // Synthetic remainder (total - completed), not a real session status.
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
          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
            <span className="text-slate-500">Điểm trung bình lớp</span>
            <span className="font-semibold text-slate-700">
              {operational.avg_score != null ? operational.avg_score : "—"}
            </span>
          </div>

          <div className="mt-3 border-t border-slate-100 pt-3">
            <p className="mb-2 text-xs font-medium text-slate-500">Phân bố điểm số</p>
            {totalGraded === 0 ? (
              <p className="text-xs text-slate-400">Chưa có kết quả thi để thống kê</p>
            ) : (
              <div className="flex flex-col gap-2">
                {operational.score_distribution.map(({ grade, count }) => {
                  const meta = getItem(EXAM_GRADE_META, grade);
                  const fallback = GRADE_FALLBACK[grade] ?? { label: grade, color: "#94a3b8" };
                  const pct = totalGraded ? Math.round((count / totalGraded) * 100) : 0;
                  return (
                    <div key={grade} className="flex items-center gap-2 text-xs">
                      <span className="w-16 shrink-0 text-slate-500">
                        {meta?.label ?? fallback.label}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: meta?.color ?? fallback.color }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right font-medium text-slate-700">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      }
    />
  );
};

export default ResultSummaryCard;
