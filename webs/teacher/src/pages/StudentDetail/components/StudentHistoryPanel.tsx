import { useMemo } from "react";
import moment from "moment";

import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import { EnrollmentService } from "@tera/modules/education";

interface EnrollmentHistoryRow {
  id: number;
  course_name: string;
  class_name: string;
  status: string;
  enrolled_at: string;
  completed_lessons: number;
  total_lessons: number;
}

const toRows = (raw: any[] | null | undefined): EnrollmentHistoryRow[] =>
  (raw ?? []).map((e) => ({
    id: e.id ?? 0,
    course_name: e.course?.name ?? "—",
    class_name: e.class?.name ?? "—",
    status: e.status ?? "",
    enrolled_at: e.enrolled_at ?? "",
    completed_lessons: e.completed_lessons ?? 0,
    total_lessons: e.total_lessons ?? 0,
  }));

/**
 * The student's learning history — their enrollment records (course, class,
 * status, progress). `edu/enrollment/list` honours `student_id` and is
 * teacher-scoped, so only enrollments in the teacher's own classes appear.
 */
const StudentHistoryPanel = ({ studentId }: { studentId: number | null }) => {
  const query = EnrollmentService.useEnrollmentList(
    { params: { per_page: 50, filters: { student_id: studentId ?? 0 } } },
    { enabled: !!studentId },
  );
  const rows = useMemo(() => toRows(query.data?.data?.items), [query.data]);

  const columns: TableColumn<EnrollmentHistoryRow>[] = [
    {
      key: "course",
      title: "Khóa học",
      render: (row) => <span className="font-medium text-slate-800">{row.course_name}</span>,
    },
    { key: "class", title: "Lớp học", cellClassName: "px-4 py-3 text-slate-500", render: (row) => row.class_name },
    {
      key: "enrolled_at",
      title: "Ngày ghi danh",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => (row.enrolled_at ? moment(row.enrolled_at).format("DD/MM/YYYY") : "—"),
    },
    {
      key: "progress",
      title: "Tiến độ",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => `${row.completed_lessons}/${row.total_lessons} buổi`,
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => <StatusBadge name="enrollment_status" value={row.status} />,
    },
  ];

  return (
    <Table
      columns={columns}
      data={rows}
      rowKey={(row) => row.id}
      isLoading={query.isLoading}
      isError={query.isError}
      onRetry={() => query.refetch()}
      errorMessage="Không tải được lịch sử học tập"
      emptyText="Chưa có lịch sử ghi danh nào"
      minWidthClassName="min-w-180"
    />
  );
};

export default StudentHistoryPanel;
