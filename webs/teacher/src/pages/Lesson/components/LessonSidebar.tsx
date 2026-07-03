import { PencilSquareOutlined } from "tera-dls";
import moment from "moment";

import Card from "_common/components/Card";
import DonutStatsCard from "_common/components/DonutStatsCard";
import { getDonutColor } from "pages/Classroom/constants";

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

      <DonutStatsCard
        title="Tiến độ lớp học"
        centerValue={`${detail.completion_rate}%`}
        centerCaption="Hoàn thành"
        showLegendList={false}
        legend={[
          {
            key: "rate",
            label: "Hoàn thành",
            color: getDonutColor(detail.completion_rate),
            value: detail.completion_rate,
          },
          {
            key: "rest",
            label: "Còn lại",
            color: "#e2e8f0",
            value: 100 - detail.completion_rate,
          },
        ]}
      />

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
