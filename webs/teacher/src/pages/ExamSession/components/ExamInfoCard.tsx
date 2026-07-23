import { ReactNode } from "react";
import {
  CalendarDaysOutlined,
  CheckBadgeOutlined,
  ClipboardDocumentCheckOutlined,
  ClockOutlined,
  MapPinOutlined,
  StarOutlined,
  UserOutlined,
  UsersOutlined,
} from "tera-dls";

import { CARD } from "_common/constants/dashboard";
import StatusBadge from "_common/components/StatusBadge";
import { useMeta } from "_common/hooks/useMeta";
import { getCoverGradient } from "pages/Classroom/constants";

import { EXAM_SESSION_STATUS_META } from "../constants";

interface ExamInfoCardProps {
  sessionId: number;
  examName: string;
  classroomName: string;
  sessionName?: string;
  status: string;
  duration: number;
  examDate: string;
  roomName: string;
  teacherName: string;
  totalScore: number;
  passingScore: number;
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

const ExamInfoCard = ({
  sessionId,
  examName,
  classroomName,
  sessionName,
  status,
  duration,
  examDate,
  roomName,
  teacherName,
  totalScore,
  passingScore,
}: ExamInfoCardProps) => {
  const { getLabel } = useMeta();

  return (
    <div className={`${CARD} overflow-hidden`}>
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
        <div
          className={`relative flex min-h-55 flex-col justify-between bg-linear-to-br p-5 text-white ${getCoverGradient(
            sessionId,
          )}`}
        >
          <span className="self-start rounded-full bg-white/25 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
            {getLabel(EXAM_SESSION_STATUS_META, status)}
          </span>
          <div className="flex flex-1 items-center justify-center py-4 [&_svg]:h-16 [&_svg]:w-16 [&_svg]:opacity-80">
            <ClipboardDocumentCheckOutlined />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">{examName}</p>
            {classroomName && <p className="text-sm text-white/80">{classroomName}</p>}
          </div>
        </div>

        <div className="p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">{examName}</h2>
            <StatusBadge name={EXAM_SESSION_STATUS_META} value={status} />
          </div>

          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            <InfoRow icon={<UsersOutlined />} label="Lớp" value={classroomName || "—"} />
            {sessionName && <InfoRow icon={<UsersOutlined />} label="Buổi học" value={sessionName} />}
            <InfoRow
              icon={<CalendarDaysOutlined />}
              label="Ngày kiểm tra"
              value={examDate || "—"}
            />
            <InfoRow
              icon={<ClockOutlined />}
              label="Thời gian làm bài"
              value={duration ? `${duration} phút` : "—"}
            />
            <InfoRow icon={<MapPinOutlined />} label="Phòng thi" value={roomName || "—"} />
            <InfoRow
              icon={<UserOutlined />}
              label="Giáo viên coi thi"
              value={teacherName || "—"}
            />
            <InfoRow
              icon={<StarOutlined />}
              label="Thang điểm"
              value={totalScore ? `${totalScore} điểm` : "—"}
            />
            <InfoRow
              icon={<CheckBadgeOutlined />}
              label="Điểm đạt"
              value={passingScore ? `${passingScore} điểm` : "—"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInfoCard;
