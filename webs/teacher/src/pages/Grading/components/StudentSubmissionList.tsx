import classNames from "classnames";
import { CheckCircleOutlined, StarOutlined } from "tera-dls";
import ChartBar from "@tera/components/dof/Chart/ChartBar";

import Avatar from "_common/components/Avatar";
import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";

import type { SubmissionRow } from "../_interface";
import { isGraded, scoreBuckets } from "../_utils";

interface StudentSubmissionListProps {
  rows: SubmissionRow[];
  selectedId: number | null;
  onSelect: (row: SubmissionRow) => void;
  maxScore: number;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const StudentSubmissionList = ({
  rows,
  selectedId,
  onSelect,
  maxScore,
  isLoading,
  isError,
  onRetry,
}: StudentSubmissionListProps) => {
  const gradedCount = rows.filter((r) => isGraded(r.status)).length;
  const ungradedCount = rows.length - gradedCount;
  const buckets = scoreBuckets(rows, maxScore);
  const step = maxScore / 4;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">Danh sách học viên</p>
        <WidgetState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && rows.length === 0}
          emptyText="Chưa có học viên nộp bài"
          onRetry={onRetry}
        >
          <div className="flex max-h-96 flex-col gap-1 overflow-y-auto">
            {rows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => onSelect(row)}
                className={classNames(
                  "flex items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors",
                  selectedId === row.id ? "bg-sky-50" : "hover:bg-slate-50",
                )}
              >
                <Avatar src={row.student_avatar} alt={row.student_name} sizeClassName="h-8 w-8" />
                <span className="flex-1 truncate text-sm font-medium text-slate-700">
                  {row.student_name}
                </span>
                {isGraded(row.status) ? (
                  <StarOutlined className="h-4 w-4 text-amber-400" />
                ) : (
                  <CheckCircleOutlined className="h-4 w-4 text-emerald-400" />
                )}
              </button>
            ))}
          </div>
        </WidgetState>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">Thống kê lớp</p>
        <div className="mb-3 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-lg bg-emerald-50 py-2">
            <p className="text-lg font-bold text-emerald-600">{gradedCount}</p>
            <p className="text-xs text-slate-500">Đã chấm</p>
          </div>
          <div className="rounded-lg bg-amber-50 py-2">
            <p className="text-lg font-bold text-amber-600">{ungradedCount}</p>
            <p className="text-xs text-slate-500">Chưa chấm</p>
          </div>
        </div>
        <p className="mb-2 text-xs font-medium text-slate-500">Phân bố điểm</p>
        <div className="h-32">
          <ChartBar
            data={{
              labels: [0, 1, 2, 3].map(
                (i) => `${Math.round(i * step)}-${Math.round((i + 1) * step)}`,
              ),
              datasets: [{ data: buckets, backgroundColor: "#38bdf8", borderRadius: 4 }],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { ticks: { stepSize: 1 } } },
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default StudentSubmissionList;
