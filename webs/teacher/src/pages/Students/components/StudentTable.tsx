import moment from "moment";
import { ChatBubbleLeftRightOutlined, EyeOutlined, PaperAirplaneOutlined, Spin } from "tera-dls";

import Avatar from "_common/components/Avatar";
import Badge from "_common/components/Badge";
import EmptyState from "_common/components/EmptyState";
import ErrorRetry from "_common/components/ErrorRetry";

import type { StudentListItem, StudentSortBy, StudentSortDir } from "../_interface";
import { getRank, getStudentStatusStyle } from "../constants";

interface StudentTableProps {
  items: StudentListItem[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  sortBy: StudentSortBy;
  sortDir: StudentSortDir;
  onSortChange: (sortBy: StudentSortBy) => void;
  onView: (student: StudentListItem) => void;
  onComment: (student: StudentListItem) => void;
  onMessage: (student: StudentListItem) => void;
  from: number;
}

const SORTABLE_COLUMNS: { key: StudentSortBy; label: string }[] = [
  { key: "name", label: "Họ và tên" },
  { key: "avg_score", label: "Điểm TB" },
];

const StudentTable = ({
  items,
  loading,
  isError,
  onRetry,
  sortBy,
  sortDir,
  onSortChange,
  onView,
  onComment,
  onMessage,
  from,
}: StudentTableProps) => {
  const sortIndicator = (key: StudentSortBy) =>
    sortBy === key ? (sortDir === "asc" ? "↑" : "↓") : "";

  const body = () => {
    if (loading)
      return (
        <tr>
          <td colSpan={9}>
            <Spin spinning>
              <div className="h-40" />
            </Spin>
          </td>
        </tr>
      );

    if (isError)
      return (
        <tr>
          <td colSpan={9}>
            <div className="flex h-40 items-center justify-center">
              <ErrorRetry onRetry={onRetry} message="Không tải được danh sách học viên" />
            </div>
          </td>
        </tr>
      );

    if (items.length === 0)
      return (
        <tr>
          <td colSpan={9}>
            <EmptyState description="Không có học viên phù hợp" />
          </td>
        </tr>
      );

    return items.map((student, i) => {
      const status = getStudentStatusStyle(student.status);
      const rank = getRank(student.avg_score);
      return (
        <tr key={student.id} className="text-slate-700">
          <td className="px-4 py-3 text-slate-400">{from + i}</td>
          <td className="px-4 py-3 text-slate-500">{student.code || "—"}</td>
          <td className="px-4 py-3">
            <button
              type="button"
              onClick={() => onView(student)}
              className="flex items-center gap-2 text-left"
            >
              <Avatar src={student.avatar} alt={student.name} />
              <span className="truncate font-medium text-slate-800 hover:text-brand">
                {student.name || "—"}
              </span>
            </button>
          </td>
          <td className="px-4 py-3 text-slate-500">
            {student.dob ? moment(student.dob, "YYYY-MM-DD").format("DD/MM/YYYY") : "—"}
          </td>
          <td className="px-4 py-3">
            {student.class_name ? (
              <Badge className="bg-sky-50 px-2.5 py-0.5 text-[11px] text-brand">
                {student.class_name}
              </Badge>
            ) : (
              "—"
            )}
          </td>
          <td className="px-4 py-3 text-slate-500">{student.phone || "—"}</td>
          <td className="px-4 py-3 text-slate-500">
            {student.avg_score != null ? student.avg_score : "—"}
          </td>
          <td className="px-4 py-3">
            <Badge className={`px-2.5 py-0.5 text-[11px] ${rank.badge}`}>
              {rank.label}
            </Badge>
          </td>
          <td className="px-4 py-3">
            <Badge className={`px-2.5 py-0.5 text-[11px] ${status.badge}`}>
              {status.label}
            </Badge>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                title="Xem hồ sơ"
                onClick={() => onView(student)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
              >
                <EyeOutlined />
              </button>
              <button
                type="button"
                title="Nhận xét"
                onClick={() => onComment(student)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
              >
                <ChatBubbleLeftRightOutlined />
              </button>
              <button
                type="button"
                title="Nhắn tin"
                onClick={() => onMessage(student)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
              >
                <PaperAirplaneOutlined />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
              <th className="whitespace-nowrap px-4 py-3">STT</th>
              <th className="whitespace-nowrap px-4 py-3">Mã HV</th>
              {SORTABLE_COLUMNS.filter((c) => c.key === "name").map((c) => (
                <th key={c.key} className="whitespace-nowrap px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSortChange(c.key)}
                    className="flex items-center gap-1 hover:text-slate-700"
                  >
                    {c.label} {sortIndicator(c.key)}
                  </button>
                </th>
              ))}
              <th className="whitespace-nowrap px-4 py-3">Ngày sinh</th>
              <th className="whitespace-nowrap px-4 py-3">Lớp học</th>
              <th className="whitespace-nowrap px-4 py-3">Điện thoại</th>
              {SORTABLE_COLUMNS.filter((c) => c.key === "avg_score").map((c) => (
                <th key={c.key} className="whitespace-nowrap px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSortChange(c.key)}
                    className="flex items-center gap-1 hover:text-slate-700"
                  >
                    {c.label} {sortIndicator(c.key)}
                  </button>
                </th>
              ))}
              <th className="whitespace-nowrap px-4 py-3">Xếp loại</th>
              <th className="whitespace-nowrap px-4 py-3">Trạng thái</th>
              <th className="whitespace-nowrap px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{body()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
