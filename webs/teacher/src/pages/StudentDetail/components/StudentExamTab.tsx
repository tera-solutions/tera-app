import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import Badge from "_common/components/Badge";
import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { ExamSessionService } from "@tera/modules/education";

import { toExamResultRows } from "pages/ExamSession/_utils";
import {
  EXAM_REGISTRATION_STATUS_META,
  EXAM_SESSION_STATUS_META,
  GRADE_LABEL,
} from "pages/ExamSession/constants";

interface StudentExamRow {
  session_id: number;
  exam_name: string;
  exam_date: string;
  session_status: string;
  registration_status: string | null;
  total_score: number | null;
  grade: string | null;
}

const toStudentExamRows = (items: any[]): StudentExamRow[] =>
  (items ?? []).map((item) => {
    const [result] = toExamResultRows(item);
    return {
      session_id: item.id,
      exam_name: item.exam?.exam_name ?? "",
      exam_date: item.exam_date ?? "",
      session_status: item.status ?? "scheduled",
      registration_status: result?.registration_status ?? null,
      total_score: result?.total_score ?? null,
      grade: result?.grade ?? null,
    };
  });

const StudentExamTab = ({ studentId }: { studentId: number | null }) => {
  const navigate = useNavigate();

  const query = ExamSessionService.useExamSessionList(
    { params: { per_page: 50, filters: { student_id: studentId ?? 0 } } },
    { enabled: !!studentId },
  );
  const rows = useMemo(() => toStudentExamRows(query.data?.data?.items), [query.data]);

  const columns: TableColumn<StudentExamRow>[] = [
    {
      key: "exam_name",
      title: "Bài kiểm tra",
      render: (row) => <span className="font-medium text-slate-800">{row.exam_name || "—"}</span>,
    },
    {
      key: "exam_date",
      title: "Ngày thi",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => (row.exam_date ? moment(row.exam_date).format("DD/MM/YYYY") : "—"),
    },
    {
      key: "session_status",
      title: "Trạng thái kỳ thi",
      render: (row) => <StatusBadge name={EXAM_SESSION_STATUS_META} value={row.session_status} />,
    },
    {
      key: "registration_status",
      title: "Trạng thái bài làm",
      render: (row) =>
        row.registration_status ? (
          <StatusBadge name={EXAM_REGISTRATION_STATUS_META} value={row.registration_status} />
        ) : (
          "—"
        ),
    },
    {
      key: "total_score",
      title: "Điểm số",
      headerClassName: "px-3 py-3 text-center",
      cellClassName: "px-3 py-3 text-center",
      render: (row) => (
        <span className="font-semibold text-slate-700">{row.total_score ?? "—"}</span>
      ),
    },
    {
      key: "grade",
      title: "Xếp loại",
      render: (row) => {
        if (!row.grade) return "—";
        const meta = GRADE_LABEL[row.grade];
        return (
          <Badge
            style={meta ? { backgroundColor: `${meta.color}1a`, color: meta.color } : undefined}
            className="px-2.5 py-0.5 text-[11px]"
          >
            {meta?.label ?? row.grade}
          </Badge>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      data={rows}
      rowKey={(row) => row.session_id}
      isLoading={query.isLoading}
      isError={query.isError}
      onRetry={() => query.refetch()}
      errorMessage="Không tải được danh sách bài kiểm tra"
      emptyText="Học viên chưa tham gia bài kiểm tra nào"
      minWidthClassName="min-w-200"
      onRowClick={(row) => navigate(`${PATHS.exam}/session/${row.session_id}`)}
    />
  );
};

export default StudentExamTab;
