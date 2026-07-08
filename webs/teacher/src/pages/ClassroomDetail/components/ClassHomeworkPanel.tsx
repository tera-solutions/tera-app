import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import Badge from "_common/components/Badge";
import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import { useMeta } from "_common/hooks/useMeta";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { AssignmentService } from "@tera/modules/education";
import type { Homework } from "pages/Homework/_interface";
import { toHomeworks, isOverdue } from "pages/Homework/_utils";
import { ASSIGNMENT_STATUS_META, ASSIGNMENT_TYPE_META } from "pages/Homework/constants";

/** Assignments scoped to this class — the real `edu/assignment/list` honours `class_room_id`. */
const ClassHomeworkPanel = ({ classId }: { classId: number | null }) => {
  const navigate = useNavigate();
  const { getLabel } = useMeta();

  const query = AssignmentService.useAssignmentList(
    { params: { per_page: 50, filters: { class_room_id: classId ?? 0 } } },
    { enabled: !!classId },
  );
  const items = useMemo(() => toHomeworks(query.data?.data?.items), [query.data]);

  const columns: TableColumn<Homework>[] = [
    {
      key: "name",
      title: "Tên bài tập",
      render: (row) => <span className="font-medium text-slate-800">{row.name || "—"}</span>,
    },
    {
      key: "type",
      title: "Loại",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => getLabel(ASSIGNMENT_TYPE_META, row.type) || "—",
    },
    {
      key: "due_date",
      title: "Hạn nộp",
      cellClassName: "px-4 py-3",
      render: (row) =>
        row.due_date ? (
          <span className={isOverdue(row.due_date) ? "text-red-500" : "text-slate-500"}>
            {moment(row.due_date).format("DD/MM/YYYY HH:mm")}
          </span>
        ) : (
          "—"
        ),
    },
    {
      key: "max_score",
      title: "Điểm tối đa",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => row.max_score || "—",
    },
    {
      key: "submissions",
      title: "Đã nộp",
      render: (row) => (
        <Badge className="bg-sky-50 px-2.5 py-0.5 text-[11px] text-brand">{row.student_count}</Badge>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => <StatusBadge name={ASSIGNMENT_STATUS_META} value={row.status} />,
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
      errorMessage="Không tải được danh sách bài tập"
      emptyText="Lớp học chưa có bài tập nào"
      minWidthClassName="min-w-200"
      onRowClick={() => navigate(PATHS.homework)}
    />
  );
};

export default ClassHomeworkPanel;
