import moment from "moment";
import {
  AcademicCapOutlined,
  CalendarDaysOutlined,
  ClockOutlined,
  MapPinOutlined,
} from "tera-dls";

import StatusBadge from "_common/components/StatusBadge";
import { CARD } from "_common/constants/dashboard";
import type { SessionDetail } from "pages/Schedule/_utils";

import InfoRow from "./InfoRow";

interface SessionSummaryCardProps {
  detail: SessionDetail;
}

const SessionSummaryCard = ({ detail }: SessionSummaryCardProps) => (
  <div className={`${CARD} p-4`}>
    <div className="mb-2 flex items-center justify-between gap-2">
      <div className="min-w-0">
        <p className="truncate text-lg font-bold text-slate-800">{detail.class_name}</p>
        <p className="text-sm text-slate-400">{detail.session_name}</p>
      </div>
      <StatusBadge name="class_session_status" value={detail.status} />
    </div>

    <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
      <InfoRow
        icon={<CalendarDaysOutlined />}
        label="Ngày"
        value={moment(detail.date).format("DD/MM/YYYY")}
      />
      <InfoRow
        icon={<ClockOutlined />}
        label="Thời gian"
        value={`${detail.start_time} - ${detail.end_time}`}
      />
      <InfoRow
        icon={<MapPinOutlined />}
        label="Phòng học"
        value={detail.room || "Chưa cập nhật"}
      />
      <InfoRow
        icon={<AcademicCapOutlined />}
        label="Giáo viên"
        value={detail.teacher_name || "Chưa phân công"}
      />
    </div>
  </div>
);

export default SessionSummaryCard;
