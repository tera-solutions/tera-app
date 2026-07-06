import { AcademicCapOutlined, CalendarDaysOutlined, Spin } from "tera-dls";

import Card from "_common/components/Card";
import ClassroomInfoCard from "_common/components/ClassroomInfoCard";
import ClassroomSwitcher from "_common/components/ClassroomSwitcher";
import { getCoverGradient } from "pages/Classroom/constants";

import type { AttendanceClassOption, AttendanceSession } from "../_interface";

interface AttendanceHeaderProps {
  classes: AttendanceClassOption[];
  classId: number | null;
  onClassChange: (id: number) => void;
  classesLoading?: boolean;
  sessions: AttendanceSession[];
  sessionId: number | null;
  onSessionChange: (id: number) => void;
  sessionsLoading?: boolean;
}

const AttendanceHeader = ({
  classes,
  classId,
  onClassChange,
  classesLoading,
  sessions,
  sessionId,
  onSessionChange,
  sessionsLoading,
}: AttendanceHeaderProps) => {
  const selectedClass = classes.find((c) => c.id === classId);
  const selectedSession = sessions.find((s) => s.id === sessionId);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ClassroomInfoCard
        loading={classesLoading}
        classroom={selectedClass}
        classrooms={classes}
        onChangeClassroom={onClassChange}
        icon={<AcademicCapOutlined />}
      />

      <Spin spinning={!!sessionsLoading}>
        <Card animated={false}>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br ${getCoverGradient(
                selectedSession?.id ?? 0,
              )} text-white [&_svg]:h-6 [&_svg]:w-6`}
            >
              <CalendarDaysOutlined />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="truncate text-base font-bold text-slate-800">
                  {selectedSession?.name || "—"}
                </p>
                <ClassroomSwitcher
                  options={sessions.map((s) => ({
                    id: s.id,
                    name: `${s.name} — ${s.date}`,
                  }))}
                  selectedId={sessionId ?? undefined}
                  onChange={onSessionChange}
                  label="Đổi buổi"
                  searchPlaceholder="Tìm buổi học..."
                  emptyText="Không có buổi học phù hợp"
                />
              </div>
              {selectedSession && (
                <p className="mt-1 truncate text-xs text-slate-400">
                  {selectedSession.date}
                  {selectedSession.start_time && selectedSession.end_time
                    ? ` · ${selectedSession.start_time} - ${selectedSession.end_time}`
                    : ""}
                </p>
              )}
            </div>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default AttendanceHeader;
