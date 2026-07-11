import { AcademicCapOutlined, Button, MapPinOutlined, UsersOutlined } from "tera-dls";

import StatusBadge from "_common/components/StatusBadge";
import { CARD } from "_common/constants/dashboard";
import type { ClassroomDetail } from "pages/ClassroomDetail/_interface";

import InfoRow from "./InfoRow";

interface ClassroomCardProps {
  loading: boolean;
  classId?: number;
  classRoom?: ClassroomDetail;
  onViewDetail: () => void;
}

const ClassroomCard = ({ loading, classId, classRoom, onViewDetail }: ClassroomCardProps) => (
  <div className={`${CARD} p-4`}>
    <div className="mb-3 flex items-center justify-between gap-2">
      <p className="text-sm font-semibold text-slate-700">Lớp học</p>
      {classRoom?.status && <StatusBadge name="class_status" value={classRoom.status} />}
    </div>
    {loading ? (
      <p className="text-sm text-slate-400">Đang tải...</p>
    ) : (
      <div className="flex flex-col gap-1">
        <InfoRow icon={<AcademicCapOutlined />} label="Tên lớp" value={classRoom?.name || "—"} />
        <InfoRow
          icon={<UsersOutlined />}
          label="Sỹ số"
          value={`${classRoom?.student_count ?? 0}${
            classRoom?.max_students ? ` / ${classRoom.max_students}` : ""
          } học viên`}
        />
        <InfoRow
          icon={<AcademicCapOutlined />}
          label="Giáo viên"
          value={classRoom?.teacher_name || "Chưa phân công"}
        />
        <InfoRow
          icon={<MapPinOutlined />}
          label="Phòng học"
          value={classRoom?.room || "Chưa cập nhật"}
        />
      </div>
    )}
    <Button
      outlined
      className="mt-4 w-full text-brand border-brand hover:bg-brand"
      disabled={!classId}
      onClick={onViewDetail}
    >
      Xem chi tiết lớp
    </Button>
  </div>
);

export default ClassroomCard;
