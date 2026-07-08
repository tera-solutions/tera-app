import moment from "moment";
import { useNavigate } from "react-router-dom";

import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { ExamSessionService } from "@tera/modules/education";
import { EXAM_SESSION_STATUS_META } from "pages/ExamSession/constants";

/** Exam sessions scoped to this class — `edu/exam-session/list` honours `class_room_id`. */
const ClassScoresPanel = ({ classId }: { classId: number | null }) => {
  const navigate = useNavigate();

  const query = ExamSessionService.useExamSessionList(
    { params: { per_page: 50, filters: { class_room_id: classId ?? 0 } } },
    { enabled: !!classId },
  );
  const items = query.data?.data?.items ?? [];

  const columns: TableColumn<any>[] = [
    {
      key: "exam",
      title: "Bài kiểm tra",
      render: (row) => <span className="font-medium text-slate-800">{row.exam?.exam_name ?? "—"}</span>,
    },
    {
      key: "room",
      title: "Phòng",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => row.room?.room_name ?? "—",
    },
    {
      key: "date",
      title: "Ngày thi",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => (row.exam_date ? moment(row.exam_date).format("DD/MM/YYYY") : "—"),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => <StatusBadge name={EXAM_SESSION_STATUS_META} value={row.status} />,
    },
  ];

  return (
    <Table
      columns={columns}
      data={items}
      rowKey={(row) => row.id}
      isLoading={query.isLoading}
      isError={query.isError}
      onRetry={() => query.refetch()}
      errorMessage="Không tải được danh sách bài kiểm tra"
      emptyText="Lớp học chưa có bài kiểm tra nào"
      minWidthClassName="min-w-200"
      onRowClick={(row) => navigate(`${PATHS.exam}/session/${row.id}`)}
    />
  );
};

export default ClassScoresPanel;
