import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  AcademicCapOutlined,
  BookOpenOutlined,
  ChartBarOutlined,
  ClipboardDocumentCheckOutlined,
  ClockOutlined,
  DocumentTextOutlined,
  Dropdown,
  EllipsisVerticalOutlined,
  EyeOutlined,
  MapPinOutlined,
  UsersOutlined,
} from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";

import type { Classroom } from "../_interface";
import { getCoverGradient, STATUS_LABEL } from "../constants";
import ProgressDonut from "./ProgressDonut";

interface ClassroomCardProps {
  classroom: Classroom;
}

interface QuickAction {
  key: string;
  label: string;
  icon: ReactNode;
  to: string;
}

const ClassroomCard = ({ classroom }: ClassroomCardProps) => {
  const navigate = useNavigate();
  const detailPath = `${PATHS.classroom}/${classroom.id}`;

  const actions: QuickAction[] = [
    {
      key: "students",
      label: "Danh sách HV",
      icon: <UsersOutlined />,
      to: `${PATHS.students}?class_id=${classroom.id}`,
    },
    {
      key: "attendance",
      label: "Điểm danh",
      icon: <ClipboardDocumentCheckOutlined />,
      to: `${PATHS.attendance}?class_id=${classroom.id}`,
    },
    {
      key: "lesson-plans",
      label: "Giáo án",
      icon: <BookOpenOutlined />,
      to: `${PATHS.lessonPlans}?class_id=${classroom.id}`,
    },
    {
      key: "homework",
      label: "Bài tập",
      icon: <DocumentTextOutlined />,
      to: `${PATHS.homework}?class_id=${classroom.id}`,
    },
    {
      key: "reports",
      label: "Báo cáo",
      icon: <ChartBarOutlined />,
      to: `${PATHS.reports}?class_id=${classroom.id}`,
    },
  ];

  const go = (to: string) => navigate(to);

  const meta = [classroom.category, classroom.level].filter(Boolean).join(" · ");
  const place = [classroom.room, classroom.branch].filter(Boolean).join(" · ");
  const timeRange =
    classroom.start_time && classroom.end_time
      ? `${classroom.start_time} - ${classroom.end_time}`
      : classroom.start_time || classroom.end_time || "Chưa xếp lịch";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => go(detailPath)}
      onKeyDown={(e) => {
        if (e.key === "Enter") go(detailPath);
      }}
      className="group flex cursor-pointer flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-shadow hover:shadow-md xl:flex-row xl:items-center"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br ${getCoverGradient(
            classroom.id,
          )} text-white [&_svg]:h-7 [&_svg]:w-7`}
        >
          {classroom.cover_image ? (
            <img
              src={classroom.cover_image}
              alt={classroom.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <AcademicCapOutlined />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold text-brand group-hover:underline">
              {classroom.name}
            </p>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              {STATUS_LABEL[classroom.status]}
            </span>
          </div>
          {meta && <p className="mt-0.5 text-xs text-slate-500">{meta}</p>}
          {place && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400 [&_svg]:h-3.5 [&_svg]:w-3.5">
              <MapPinOutlined />
              {place}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-xs text-slate-500">
          <p className="flex items-center gap-1 font-medium text-slate-700 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:text-brand">
            <ClockOutlined />
            {timeRange}
          </p>
          {classroom.schedule_days && (
            <p className="mt-0.5">{classroom.schedule_days}</p>
          )}
        </div>

        <div className="text-center">
          <p className="flex items-center justify-center gap-1 text-sm font-semibold text-slate-700 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-brand">
            <UsersOutlined />
            {classroom.student_count}
            {classroom.max_students ? `/${classroom.max_students}` : ""}
          </p>
          <p className="text-[11px] text-slate-400">Học viên</p>
        </div>

        <ProgressDonut value={classroom.completion_rate} label="Chuyên cần" />
      </div>

      <div
        className="flex items-center gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            title={action.label}
            onClick={() => go(action.to)}
            className="flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-slate-500 hover:bg-slate-50 hover:text-brand [&_svg]:h-5 [&_svg]:w-5"
          >
            {action.icon}
            <span className="hidden whitespace-nowrap xmd:block">
              {action.label}
            </span>
          </button>
        ))}
        <Dropdown
          trigger="click"
          menu={{
            itemClassName: "text-slate-700 hover:bg-brand! hover:text-white!",
            items: [
              {
                key: "detail",
                label: "Xem chi tiết",
                icon: <EyeOutlined />,
                onClick: () => go(detailPath),
              },
            ],
          }}
        >
          <button
            type="button"
            title="Thêm"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 [&_svg]:h-5 [&_svg]:w-5"
          >
            <EllipsisVerticalOutlined />
          </button>
        </Dropdown>
      </div>
    </div>
  );
};

export default ClassroomCard;
