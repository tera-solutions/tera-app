import {
  AcademicCapOutlined,
  BookOpenOutlined,
  CalendarDaysOutlined,
  ClockOutlined,
  EllipsisVerticalOutlined,
  MapPinOutlined,
  PencilSquareOutlined,
} from "tera-dls";
import moment from "moment";

import Card from "_common/components/Card";
import StatusBadge from "_common/components/StatusBadge";

import type { LessonDetail } from "../_interface";
import { LESSON_STATUS_META } from "../constants";

interface LessonHeaderProps {
  detail: LessonDetail;
  onEdit: () => void;
  onMore: () => void;
}

const LessonHeader = ({ detail, onEdit, onMore }: LessonHeaderProps) => {
  const location = [detail.class_name, detail.room].filter(Boolean).join(" • ");
  const audience = [detail.audience, detail.level].filter(Boolean).join(" – ");

  const meta = [
    detail.duration
      ? { icon: <ClockOutlined />, label: `${detail.duration} phút` }
      : null,
    audience ? { icon: <AcademicCapOutlined />, label: audience } : null,
    detail.date
      ? {
          icon: <CalendarDaysOutlined />,
          label: moment(detail.date).format("DD/MM/YYYY"),
        }
      : null,
    location ? { icon: <MapPinOutlined />, label: location } : null,
  ].filter(Boolean) as { icon: React.ReactNode; label: string }[];

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sky-50 text-brand [&_svg]:h-7 [&_svg]:w-7">
            {detail.avatar ? (
              <img
                src={detail.avatar}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <BookOpenOutlined />
            )}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-slate-800">
              {detail.lesson_title || "Bài học"}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {detail.unit && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {detail.unit}
                </span>
              )}
              <StatusBadge
                name={LESSON_STATUS_META}
                value={detail.status}
                className="gap-1 text-xs"
              />
            </div>

            {meta.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:text-slate-400">
                {meta.map((item, index) => (
                  <span key={index} className="flex items-center gap-1">
                    {item.icon}
                    {item.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 [&_svg]:h-4 [&_svg]:w-4"
          >
            <PencilSquareOutlined />
            Chỉnh sửa bài học
          </button>
          <button
            type="button"
            onClick={onMore}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 [&_svg]:h-5 [&_svg]:w-5"
          >
            <EllipsisVerticalOutlined />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default LessonHeader;
