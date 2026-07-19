import { Button, StarOutlined } from "tera-dls";

import Avatar from "_common/components/Avatar";
import { CARD } from "_common/constants/dashboard";
import type { AttendanceRow } from "pages/Attendance/_interface";

interface StepEvaluationProps {
  students: AttendanceRow[];
  onEvaluate: (student: AttendanceRow) => void;
}

const StepEvaluation = ({ students, onEvaluate }: StepEvaluationProps) => (
  <div className={`${CARD} p-4`}>
    <p className="mb-3 text-sm font-semibold text-slate-700">Đánh giá học viên</p>
    {students.length === 0 ? (
      <p className="text-sm text-slate-400">Không có học viên tham gia buổi học này.</p>
    ) : (
      <div className="flex flex-col gap-2">
        {students.map((student) => (
          <div
            key={student.student_id}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
          >
            <Avatar src={student.avatar} alt={student.name} sizeClassName="h-9 w-9" />
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
              {student.name}
            </p>
            <Button
              outlined
              icon={<StarOutlined />}
              onClick={() => onEvaluate(student)}
              className="shrink-0 whitespace-nowrap text-brand border-brand hover:bg-brand"
            >
              Đánh giá kỹ năng
            </Button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default StepEvaluation;
