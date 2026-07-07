import { useNavigate } from "react-router-dom";

import Avatar from "_common/components/Avatar";
import EmptyState from "_common/components/EmptyState";
import StatusBadge from "_common/components/StatusBadge";
import { PATHS } from "_common/components/Layout/Menu/menus";

import type { RoomStudent } from "../_interface";

const StudentAvatarGrid = ({ students }: { students: RoomStudent[] }) => {
  const navigate = useNavigate();

  if (students.length === 0) {
    return <EmptyState description="Chưa có học viên điểm danh cho buổi học này" className="py-6" />;
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {students.map((student) => (
        <button
          key={student.id}
          type="button"
          onClick={() => navigate(`${PATHS.studentDetail}/${student.id}`)}
          className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-100 p-2.5 text-center hover:bg-slate-50"
        >
          <Avatar src={student.avatar} alt={student.name} />
          <p className="w-full truncate text-xs font-medium text-slate-700">
            {student.name || "—"}
          </p>
          <StatusBadge name="attendance_status" value={student.status} />
        </button>
      ))}
    </div>
  );
};

export default StudentAvatarGrid;
