import { PencilSquareOutlined } from "tera-dls";
import moment from "moment";

import Card from "_common/components/Card";
import ProgressDonut from "pages/Classroom/components/ProgressDonut";

import type { LessonDetail } from "../_interface";
import LessonNote from "./LessonNote";

interface LessonSidebarProps {
  detail: LessonDetail;
  /** Sourced from the lesson's plan — falls back to the lesson's own value. */
  courseName?: string;
  level?: string;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-slate-400">{label}</p>
    <p className="text-sm font-medium text-slate-700">{value || "—"}</p>
  </div>
);

const LessonSidebar = ({ detail, courseName, level }: LessonSidebarProps) => {
  const updatedAt = detail.updated_at
    ? moment(detail.updated_at).format("DD/MM/YYYY")
    : "";
  const updatedLabel = [updatedAt, detail.updated_by && `bởi ${detail.updated_by}`]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">
          Thông tin bài học
        </p>
        <div className="flex flex-col gap-3">
          <InfoRow label="Khóa học" value={courseName || detail.course_name} />
          <InfoRow label="Cấp độ" value={level || detail.level} />
          <InfoRow label="Đối tượng" value={detail.audience} />
          <InfoRow
            label="Thời lượng"
            value={detail.duration ? `${detail.duration} phút` : ""}
          />
          {detail.created_at && (
            <InfoRow
              label="Ngày tạo"
              value={moment(detail.created_at).format("DD/MM/YYYY")}
            />
          )}
          {updatedLabel && (
            <InfoRow label="Cập nhật lần cuối" value={updatedLabel} />
          )}
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">
          Tiến độ lớp học
        </p>
        <div className="flex flex-col items-center gap-1 py-2">
          <ProgressDonut value={detail.completion_rate} size={120} />
          <p className="text-xs text-slate-400">Hoàn thành</p>
        </div>
      </Card>

      <Card>
        <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-700 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-brand">
          <PencilSquareOutlined />
          Ghi chú nhanh
        </p>
        <LessonNote lessonId={detail.id} initialNote={detail.lesson_note} />
      </Card>
    </div>
  );
};

export default LessonSidebar;
