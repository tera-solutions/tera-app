import { PencilSquareOutlined } from "tera-dls";

import Avatar from "_common/components/Avatar";
import Badge from "_common/components/Badge";
import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";

import type { ExamResultRow } from "../_interface";
import { EXAM_REGISTRATION_STATUS_META, SKILL_LABEL } from "../constants";
import { EXAM_SKILLS } from "../_interface";

interface StudentResultTableProps {
  rows: ExamResultRow[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onGrade?: (row: ExamResultRow) => void;
  showSkillColumns?: boolean;
}

const StudentResultTable = ({
  rows,
  isLoading,
  isError,
  onRetry,
  onGrade,
  showSkillColumns = true,
}: StudentResultTableProps) => {
  const columns: TableColumn<ExamResultRow>[] = [
    {
      key: "student",
      title: "Học viên",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar src={row.student_avatar} alt={row.student_name} sizeClassName="h-8 w-8" />
          <span className="font-medium text-slate-700">{row.student_name}</span>
        </div>
      ),
    },
    ...(showSkillColumns
      ? EXAM_SKILLS.map(
          (skill): TableColumn<ExamResultRow> => ({
            key: skill,
            title: SKILL_LABEL[skill],
            headerClassName: "px-3 py-3 text-center whitespace-nowrap",
            cellClassName: "px-3 py-3 text-center",
            render: (row) => row.scores[skill] ?? "—",
          }),
        )
      : []),
    {
      key: "total_score",
      title: "Điểm TB",
      headerClassName: "px-3 py-3 text-center",
      cellClassName: "px-3 py-3 text-center",
      render: (row) => (
        <span className="font-semibold text-slate-700">{row.total_score ?? "—"}</span>
      ),
    },
    {
      key: "result",
      title: "Kết quả",
      render: (row) =>
        row.total_score == null ? (
          "—"
        ) : (
          <Badge
            className={
              row.passed
                ? "bg-emerald-50 px-2.5 py-0.5 text-[11px] text-emerald-600"
                : "bg-red-50 px-2.5 py-0.5 text-[11px] text-red-500"
            }
          >
            {row.passed ? "Đạt" : "Không đạt"}
          </Badge>
        ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => <StatusBadge name={EXAM_REGISTRATION_STATUS_META} value={row.registration_status} />,
    },
    ...(onGrade
      ? [
          {
            key: "actions",
            title: "",
            headerClassName: "px-4 py-3",
            cellClassName: "px-4 py-3 text-right",
            render: (row: ExamResultRow) => (
              <button
                type="button"
                title="Chấm điểm"
                onClick={() => onGrade(row)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4 [&_svg]:w-4"
              >
                <PencilSquareOutlined />
              </button>
            ),
          } as TableColumn<ExamResultRow>,
        ]
      : []),
  ];

  return (
    <Table
      columns={columns}
      data={rows}
      rowKey={(row) => row.registration_id}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      errorMessage="Không tải được kết quả bài kiểm tra"
      emptyText="Chưa có học viên đăng ký dự thi"
      minWidthClassName="min-w-200"
    />
  );
};

export default StudentResultTable;
