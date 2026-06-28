import { useNavigate } from "react-router-dom";
import { AcademicCapOutlined, UsersOutlined } from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";

import type { Classroom } from "../_interface";
import { getCoverGradient, STATUS_LABEL } from "../constants";
import ProgressDonut from "./ProgressDonut";

interface ClassroomGridCardProps {
  classroom: Classroom;
}

const ClassroomGridCard = ({ classroom }: ClassroomGridCardProps) => {
  const navigate = useNavigate();
  const meta = [classroom.category, classroom.level].filter(Boolean).join(" · ");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`${PATHS.classroom}/${classroom.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(`${PATHS.classroom}/${classroom.id}`);
      }}
      className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div
        className={`flex h-28 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${getCoverGradient(
          classroom.id,
        )} text-white [&_svg]:h-10 [&_svg]:w-10`}
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

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-800 group-hover:text-brand">
            {classroom.name}
          </p>
          {meta && <p className="mt-0.5 text-xs text-slate-500">{meta}</p>}
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400 [&_svg]:h-3.5 [&_svg]:w-3.5">
            <UsersOutlined />
            {classroom.student_count}
            {classroom.max_students ? `/${classroom.max_students}` : ""} học viên
          </p>
        </div>
        <ProgressDonut value={classroom.completion_rate} size={48} />
      </div>

      <span className="self-start rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
        {STATUS_LABEL[classroom.status]}
      </span>
    </div>
  );
};

export default ClassroomGridCard;
