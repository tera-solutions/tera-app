import { ReactNode } from "react";
import moment from "moment";
import {
  AcademicCapOutlined,
  ArrowDownTrayOutlined,
  BookOpenOutlined,
  Button,
  CalendarDaysOutlined,
  ClockOutlined,
  IdentificationOutlined,
  MapPinOutlined,
  PencilSquareOutlined,
  UserOutlined,
  UsersOutlined,
  VideoCameraOutlined,
} from "tera-dls";

import { CARD } from "_common/constants/dashboard";
import { getCoverGradient } from "pages/Classroom/constants";

import type { ClassroomDetail } from "../_interface";
import { getClassStatus, LEARNING_TYPE_LABEL } from "../constants";

interface ClassroomInfoCardProps {
  detail: ClassroomDetail;
  maxStudents: number;
  lessonPlan?: { id: number; name: string };
  onViewLessonPlan?: () => void;
  onEdit: () => void;
  onExport: () => void;
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) => (
  <div className="flex items-center gap-2 py-1.5">
    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-slate-400 [&_svg]:h-4 [&_svg]:w-4">
      {icon}
    </span>
    <span className="w-28 shrink-0 text-xs text-slate-400">{label}</span>
    <span className="min-w-0 text-sm font-medium text-slate-700">{value}</span>
  </div>
);

const fmtDate = (value: string) =>
  value ? moment(value, "YYYY-MM-DD").format("DD/MM/YYYY") : "—";

const ClassroomInfoCard = ({
  detail,
  maxStudents,
  lessonPlan,
  onViewLessonPlan,
  onEdit,
  onExport,
}: ClassroomInfoCardProps) => {
  const status = getClassStatus(detail.status);
  const timeRange =
    detail.start_time && detail.end_time
      ? `(${detail.start_time} - ${detail.end_time})`
      : "";
  const learning =
    LEARNING_TYPE_LABEL[detail.learning_type?.toLowerCase()] ??
    detail.learning_type ??
    "—";

  return (
    <div className={`${CARD} overflow-hidden`}>
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
        <div
          className={`relative flex min-h-55 flex-col justify-between bg-linear-to-br p-5 text-white ${getCoverGradient(
            detail.id,
          )}`}
        >
          <span className="self-start rounded-full bg-white/25 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
            {status.label}
          </span>
          <div className="flex flex-1 items-center justify-center py-4 [&_svg]:h-16 [&_svg]:w-16 [&_svg]:opacity-80">
            {detail.cover_image ? (
              <img
                src={detail.cover_image}
                alt={detail.name}
                className="max-h-32 rounded-xl object-cover"
              />
            ) : (
              <BookOpenOutlined />
            )}
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">{detail.name}</p>
            {detail.level && (
              <p className="text-sm text-white/80">{detail.level}</p>
            )}
          </div>
        </div>

        <div className="p-5">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800">
                  {detail.name}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${status.badge}`}
                >
                  {status.label}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                icon={<PencilSquareOutlined />}
                onClick={onEdit}
                className="whitespace-nowrap bg-brand hover:bg-brand/80"
              >
                Sửa thông tin lớp
              </Button>
              <Button
                outlined
                icon={<ArrowDownTrayOutlined />}
                onClick={onExport}
                className="text-brand border-brand hover:bg-brand"
              >
                Tải danh sách lớp
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            <InfoRow
              icon={<IdentificationOutlined />}
              label="Mã lớp"
              value={detail.code || "—"}
            />
            <InfoRow
              icon={<AcademicCapOutlined />}
              label="Trình độ"
              value={detail.level || "—"}
            />
            <InfoRow
              icon={<UserOutlined />}
              label="Giáo viên"
              value={detail.teacher_name || "—"}
            />
            <InfoRow
              icon={<UsersOutlined />}
              label="Sỹ số"
              value={`${detail.student_count}${
                maxStudents ? ` / ${maxStudents}` : ""
              } học viên`}
            />
            <InfoRow
              icon={<VideoCameraOutlined />}
              label="Hình thức học"
              value={learning}
            />
            <InfoRow
              icon={<MapPinOutlined />}
              label="Phòng học"
              value={detail.room || "—"}
            />
            <InfoRow
              icon={<CalendarDaysOutlined />}
              label="Lịch học"
              value={
                [detail.schedule_days, timeRange].filter(Boolean).join(" ") ||
                "Chưa xếp lịch"
              }
            />
            <InfoRow
              icon={<BookOpenOutlined />}
              label="Giáo án"
              value={
                lessonPlan ? (
                  <button
                    type="button"
                    onClick={onViewLessonPlan}
                    className="text-brand hover:underline"
                  >
                    {lessonPlan.name || "—"}
                  </button>
                ) : (
                  detail.lesson_plan_name || "—"
                )
              }
            />
            <InfoRow
              icon={<ClockOutlined />}
              label="Ngày khai giảng"
              value={fmtDate(detail.start_date)}
            />
            <InfoRow
              icon={<ClockOutlined />}
              label="Ngày kết thúc"
              value={fmtDate(detail.end_date)}
            />
          </div>

          {detail.description && (
            <div className="mt-3 border-t border-slate-100 pt-3">
              <p className="text-xs text-slate-400">Mô tả lớp</p>
              <p className="mt-1 text-sm text-slate-600">
                {detail.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassroomInfoCard;
