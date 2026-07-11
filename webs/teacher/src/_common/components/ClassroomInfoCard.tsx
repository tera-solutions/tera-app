import { ReactNode } from "react";
import { MapPinOutlined, Spin } from "tera-dls";

import Card from "_common/components/Card";
import ClassroomSwitcher from "_common/components/ClassroomSwitcher";
import { getCoverGradient } from "pages/Classroom/constants";

interface ClassroomOption {
  id: number;
  name: string;
}

interface ClassroomMetaRowProps {
  icon: ReactNode;
  children: ReactNode;
}

/** One icon + text meta line under the classroom name. */
export const ClassroomMetaRow = ({ icon, children }: ClassroomMetaRowProps) => (
  <p className="flex items-center gap-1 truncate font-medium text-slate-600 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0 [&_svg]:text-brand">
    {icon}
    {children}
  </p>
);

interface ClassroomInfoCardClassroom {
  id: number;
  name: string;
  cover_image?: string;
  category?: string;
  level?: string;
  room?: string;
  branch?: string;
}

interface ClassroomInfoCardProps {
  /** Shows a spinner over an empty placeholder while the classroom list loads. */
  loading?: boolean;
  classroom?: ClassroomInfoCardClassroom | null;
  classrooms: ClassroomOption[];
  onChangeClassroom: (id: number) => void;
  /** Shown when the classroom has no `cover_image`. */
  icon: ReactNode;
}

/**
 * Shared "classroom" header card — icon avatar, name, the "Đổi lớp" switcher
 * (only rendered when there's more than one classroom to pick from), and the
 * category/level and room/branch meta rows. Used by both the Lesson Plan
 * Detail and Attendance pages so the two look and behave the same way.
 */
const ClassroomInfoCard = ({
  loading,
  classroom,
  classrooms,
  onChangeClassroom,
  icon,
}: ClassroomInfoCardProps) => {
  if (loading) {
    return (
      <Spin spinning>
        <Card animated={false}>
          <div className="h-14" />
        </Card>
      </Spin>
    );
  }

  if (!classroom) return null;

  const category = [classroom.category, classroom.level].filter(Boolean).join(" · ");
  const place = [classroom.room, classroom.branch].filter(Boolean).join(" · ");

  return (
    <Card animated={false}>
      <div className="flex items-center gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br ${getCoverGradient(
            classroom.id,
          )} text-white [&_svg]:h-6 [&_svg]:w-6`}
        >
          {classroom.cover_image ? (
            <img
              src={classroom.cover_image}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            icon
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="truncate text-base font-bold text-slate-800">
              {classroom.name || "—"}
            </p>
            <ClassroomSwitcher
              options={classrooms}
              selectedId={classroom.id}
              onChange={onChangeClassroom}
            />
          </div>

          {(category || place) && (
            <div className="flex flex-col gap-1 text-xs text-slate-400">
              {category && (
                <p className="truncate text-xs font-medium text-slate-600">{category}</p>
              )}
              {place && (
                <ClassroomMetaRow icon={<MapPinOutlined />}>{place}</ClassroomMetaRow>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ClassroomInfoCard;
