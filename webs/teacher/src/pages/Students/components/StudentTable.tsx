import moment from "moment";
import { ChatBubbleLeftRightOutlined, EyeOutlined, PaperAirplaneOutlined } from "tera-dls";

import Avatar from "_common/components/Avatar";
import Badge from "_common/components/Badge";
import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";

import type { StudentListItem, StudentSortBy, StudentSortDir } from "../_interface";
import { getRank, STUDENT_STATUS_META } from "../constants";

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
}

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
}: StudentTableProps) => {
  const sortableHeader = (key: StudentSortBy, label: string) => (
    <button type="button" onClick={() => onSortChange(key)} className="flex items-center gap-1 hover:text-slate-700">
      {label} {sortBy === key ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </button>
  );

  const columns: TableColumn<StudentListItem>[] = [
    {
      key: "code",
      title: "Mã HV",
      render: (student) => (
        <button
          type="button"
          onClick={() => onView(student)}
          className="truncate font-medium text-slate-800 hover:text-brand"
        >
          {student.code || "—"}
        </button>
      ),
    },
    {
      key: "avatar",
      title: "Ảnh",
      render: (student) => (
        <Avatar src={student.avatar} alt={student.name} sizeClassName="size-9" iconClassName="bg-sky-50 text-brand" />
      ),
    },
    {
      key: "name",
      title: sortableHeader("name", "Họ và tên"),
      cellClassName: "px-4 py-3 text-slate-500 truncate",
      render: (student) => student.name || "—",
    },
    {
      key: "dob",
      title: "Ngày sinh",
      render: (student) => (student.dob ? moment(student.dob, "YYYY-MM-DD").format("DD/MM/YYYY") : "—"),
    },
    {
      key: "class_name",
      title: "Lớp học",
      render: (student) =>
        student.class_name ? (
          <Badge className="bg-sky-50 px-2.5 py-0.5 text-[11px] text-brand">{student.class_name}</Badge>
        ) : (
          "—"
        ),
    },
    { key: "phone", title: "Điện thoại", render: (student) => student.phone || "—" },
    {
      key: "avg_score",
      title: sortableHeader("avg_score", "Điểm TB"),
      render: (student) => (student.avg_score != null ? student.avg_score : "—"),
    },
    {
      key: "rank",
      title: "Xếp loại",
      render: (student) => {
        const rank = getRank(student.avg_score);
        return <Badge className={`px-2.5 py-0.5 text-[11px] ${rank.badge}`}>{rank.label}</Badge>;
      },
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (student) => <StatusBadge name={STUDENT_STATUS_META} value={student.status} />,
    },
    {
      key: "actions",
      title: "Thao tác",
      render: (student) => (
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
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={items}
      rowKey={(student) => student.id}
      isLoading={loading}
      isError={isError}
      onRetry={onRetry}
      errorMessage="Không tải được danh sách học viên"
      emptyText="Không có học viên phù hợp"
      minWidthClassName="min-w-225"
    />
  );
};

export default StudentTable;
