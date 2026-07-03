import { AcademicCapOutlined, ArrowUpTrayOutlined, Button } from "tera-dls";

import Card from "_common/components/Card";
import ClassroomSelect from "_common/components/ClassroomSelect";
import IconBox from "_common/components/IconBox";
import SessionSelect from "_common/components/SessionSelect";

import type { AttendanceClassOption, AttendanceSession } from "../_interface";

interface AttendanceHeaderProps {
  classes: AttendanceClassOption[];
  classId: number | null;
  onClassChange: (id: number) => void;
  sessions: AttendanceSession[];
  sessionId: number | null;
  onSessionChange: (id: number) => void;
  studentCount: number;
  onExport: () => void;
  exporting?: boolean;
}

const AttendanceHeader = ({
  classes,
  classId,
  onClassChange,
  sessions,
  sessionId,
  onSessionChange,
  studentCount,
  onExport,
  exporting,
}: AttendanceHeaderProps) => {
  const selectedClass = classes.find((c) => c.id === classId);
  const selectedSession = sessions.find((s) => s.id === sessionId);

  return (
    <Card animated={false}>
      <div className="flex flex-col gap-4 xmd:flex-row xmd:items-center xmd:justify-between">
        <div className="flex items-center gap-3">
          <IconBox
            icon={<AcademicCapOutlined />}
            sizeClassName="h-12 w-12"
            roundedClassName="rounded-2xl"
            iconSizeClassName="[&_svg]:h-6 [&_svg]:w-6"
          />
          <div className="min-w-0">
            <div className="w-48">
              <ClassroomSelect
                value={classId ?? undefined}
                selectedOption={
                  selectedClass ? { value: selectedClass.id, label: selectedClass.name } : null
                }
                onChange={(value) => value != null && onClassChange(Number(value))}
              />
            </div>
            {selectedClass && (
              <p className="mt-1 truncate text-xs text-slate-400">
                {selectedClass.room && `${selectedClass.room} · `}
                {selectedClass.schedule_days} · {selectedClass.start_time}
                {" · "}
                {studentCount} học viên
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-56">
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
          <Button
            outlined
            loading={exporting}
            icon={<ArrowUpTrayOutlined />}
            onClick={onExport}
            className="whitespace-nowrap text-brand border-brand hover:bg-brand"
          >
            Xuất báo cáo
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AttendanceHeader;
