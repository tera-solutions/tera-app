import moment from "moment";
import {
  CakeOutlined,
  CalendarDaysOutlined,
  CheckBadgeOutlined,
  DocumentTextOutlined,
  EnvelopeOutlined,
  IdentificationOutlined,
  MapPinOutlined,
  PhoneOutlined,
} from "tera-dls";

import Avatar from "_common/components/Avatar";
import Card from "_common/components/Card";
import StatusBadge from "_common/components/StatusBadge";
import { useMeta } from "_common/hooks/useMeta";

import type { StudentDetail } from "../_interface";

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center gap-2 py-1.5">
    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-slate-400 [&_svg]:h-4 [&_svg]:w-4">
      {icon}
    </span>
    <span className="w-20 shrink-0 text-xs text-slate-400">{label}</span>
    <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">{value}</span>
  </div>
);

const StudentProfileCard = ({ detail }: { detail: StudentDetail }) => {
  const { getLabel } = useMeta();

  return (
    <Card>
      <div className="flex items-center gap-3">
        <Avatar
          src={detail.avatar}
          alt={detail.name}
          sizeClassName="h-16 w-16"
          iconSizeClassName="[&_svg]:h-7 [&_svg]:w-7"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-base font-bold text-slate-800">{detail.name || "—"}</p>
            <StatusBadge name="student_status" value={detail.status} />
          </div>
          <p className="text-xs text-slate-400">{detail.class_name || "—"}</p>
        </div>
      </div>

      <div className="mt-3 border-t border-slate-100 pt-3">
        <InfoRow icon={<IdentificationOutlined />} label="Mã học viên" value={detail.code || "—"} />
        <InfoRow
          icon={<CakeOutlined />}
          label="Ngày sinh"
          value={detail.dob ? moment(detail.dob, "YYYY-MM-DD").format("DD/MM/YYYY") : "—"}
        />
        <InfoRow
          icon={<IdentificationOutlined />}
          label="Giới tính"
          value={getLabel("gender", detail.gender) || "—"}
        />
        <InfoRow icon={<PhoneOutlined />} label="SĐT" value={detail.phone || "—"} />
        <InfoRow icon={<EnvelopeOutlined />} label="Email" value={detail.email || "—"} />
        <InfoRow icon={<MapPinOutlined />} label="Địa chỉ" value={detail.address || "—"} />
        <InfoRow
          icon={<CalendarDaysOutlined />}
          label="Ngày đăng ký"
          value={detail.enrolled_at ? moment(detail.enrolled_at, "YYYY-MM-DD").format("DD/MM/YYYY") : "—"}
        />
        <InfoRow
          icon={<CheckBadgeOutlined />}
          label="Tình trạng"
          value={getLabel("student_status", detail.status) || "—"}
        />
        {detail.note && <InfoRow icon={<DocumentTextOutlined />} label="Ghi chú" value={detail.note} />}
      </div>
    </Card>
  );
};

export default StudentProfileCard;
