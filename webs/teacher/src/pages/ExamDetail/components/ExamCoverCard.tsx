import { ClipboardDocumentCheckOutlined } from "tera-dls";

import Card from "_common/components/Card";
import StatusBadge from "_common/components/StatusBadge";

import type { ExamBank } from "../_interface";
import { EXAM_STATUS_META } from "../constants";

interface ExamCoverCardProps {
  exam: ExamBank;
}

const ExamCoverCard = ({ exam }: ExamCoverCardProps) => (
  <Card>
    <div className="flex items-start gap-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-sky-400 to-brand text-white [&_svg]:h-8 [&_svg]:w-8">
        <ClipboardDocumentCheckOutlined />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-lg font-bold text-slate-800">{exam.name}</p>
          <StatusBadge name={EXAM_STATUS_META} value={exam.status} />
        </div>
        <p className="mt-0.5 text-xs text-slate-400">{exam.code}</p>
        <p className="mt-1 text-sm text-slate-600">
          {[exam.course_name, exam.level_name].filter(Boolean).join(" · ") || "—"}
        </p>
      </div>
    </div>
  </Card>
);

export default ExamCoverCard;
