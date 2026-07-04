import { useState } from "react";
import { AcademicCapOutlined, ClockOutlined, MapPinOutlined, UsersOutlined } from "tera-dls";

import Card from "_common/components/Card";
import ClassroomSelect from "_common/components/ClassroomSelect";
import SessionSelect from "_common/components/SessionSelect";
import { getCoverGradient } from "pages/Classroom/constants";

import type { AttendanceClassOption, AttendanceSession } from "../_interface";

interface AttendanceHeaderProps {
  classes: AttendanceClassOption[];
  classId: number | null;
  onClassChange: (id: number) => void;
  sessions: AttendanceSession[];
  sessionId: number | null;
  onSessionChange: (id: number) => void;
  studentCount: number;
}

const AttendanceHeader = ({
  classes,
  classId,
  onClassChange,
  sessions,
  sessionId,
  onSessionChange,
  studentCount,
}: AttendanceHeaderProps) => {
  const selectedClass = classes.find((c) => c.id === classId);
  const selectedSession = sessions.find((s) => s.id === sessionId);

  const [failedCoverId, setFailedCoverId] = useState<number | null>(null);
  const showCoverImage = !!selectedClass?.cover_image && selectedClass.id !== failedCoverId;

  const meta = selectedClass
    ? [selectedClass.category, selectedClass.level].filter(Boolean).join(" · ")
    : "";
  const place = selectedClass
    ? [selectedClass.room, selectedClass.branch].filter(Boolean).join(" · ")
    : "";
  const timeRange = selectedClass?.start_time && selectedClass?.end_time
    ? `${selectedClass.start_time} - ${selectedClass.end_time}`
    : selectedClass?.start_time || "";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card animated={false}>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br ${getCoverGradient(
              selectedClass?.id ?? 0,
            )} text-white [&_svg]:h-6 [&_svg]:w-6`}
          >
            {showCoverImage ? (
              <img
                src={selectedClass!.cover_image}
                alt={selectedClass!.name}
                className="h-full w-full object-cover"
                onError={() => setFailedCoverId(selectedClass!.id)}
              />
            ) : (
              <AcademicCapOutlined />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="w-44">
              <ClassroomSelect
                value={classId ?? undefined}
                selectedOption={
                  selectedClass ? { value: selectedClass.id, label: selectedClass.name } : null
                }
                onChange={(value) => value != null && onClassChange(Number(value))}
              />
            </div>

            {selectedClass && (
              <div className="mt-1.5 flex flex-col gap-1 text-xs text-slate-400">
                {meta && <p className="truncate">{meta}</p>}

                {place && (
                  <p className="flex items-center gap-1 font-medium text-slate-600 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0 [&_svg]:text-brand">
                    <MapPinOutlined />
                    {place}
                  </p>
                )}

                {timeRange && (
                  <p className="flex items-center gap-1 font-medium text-slate-600 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0 [&_svg]:text-brand">
                    <ClockOutlined />
                    {timeRange}
                    {selectedClass.schedule_days && ` (${selectedClass.schedule_days})`}
                  </p>
                )}

                <p className="flex items-center gap-1 font-medium text-slate-600 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0 [&_svg]:text-brand">
                  <UsersOutlined />
                  {studentCount}
                  {selectedClass.max_students ? `/${selectedClass.max_students}` : ""} học viên
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card animated={false}>
        <div className="flex h-full items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs text-slate-400">Buổi học</p>
            <SessionSelect
              classId={classId}
              value={sessionId ?? undefined}
              selectedOption={
                selectedSession
                  ? {
                      value: selectedSession.id,
                      label: `${selectedSession.name} — ${selectedSession.date}`,
                    }
                  : null
              }
              onChange={(value) => value != null && onSessionChange(Number(value))}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceHeader;
