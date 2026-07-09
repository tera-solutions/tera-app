import { useMemo, useState } from "react";
import { EyeOutlined } from "tera-dls";

import Avatar from "_common/components/Avatar";
import Badge from "_common/components/Badge";
import SearchInput from "_common/components/SearchInput";
import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";

import type { ExamResultRow } from "../_interface";
import { EXAM_REGISTRATION_STATUS_META, GRADE_LABEL, SKILL_LABEL } from "../constants";
import { EXAM_SKILLS } from "../_interface";

interface StudentResultTableProps {
  rows: ExamResultRow[];
  totalScore?: number;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onGrade?: (row: ExamResultRow) => void;
  showSkillColumns?: boolean;
}

const StudentResultTable = ({
  rows,
  totalScore,
  isLoading,
  isError,
  onRetry,
  onGrade,
  showSkillColumns = true,
}: StudentResultTableProps) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (r) =>
        r.student_name.toLowerCase().includes(term) ||
        r.student_code.toLowerCase().includes(term),
    );
  }, [rows, search]);

  const columns: TableColumn<ExamResultRow>[] = [
    {
      key: "stt",
      title: "#",
      cellClassName: "px-4 py-3 text-slate-400",
      render: (_row, i) => i + 1,
    },
    {
      key: "student",
      title: "Học viên",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar src={row.student_avatar} alt={row.student_name} sizeClassName="h-8 w-8" />
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-700">{row.student_name}</p>
            {row.student_code && (
              <p className="truncate text-[11px] text-slate-400">{row.student_code}</p>
            )}
          </div>
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
      key: "status",
      title: "Trạng thái",
      render: (row) => <StatusBadge name={EXAM_REGISTRATION_STATUS_META} value={row.registration_status} />,
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
      key: "percent",
      title: "Tỷ lệ %",
      headerClassName: "px-3 py-3 text-center",
      cellClassName: "px-3 py-3 text-center",
      render: (row) =>
        row.total_score != null && totalScore
          ? `${Math.round((row.total_score / totalScore) * 100)}%`
          : "—",
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
    ...(onGrade
      ? [
          {
            key: "actions",
            title: "Thao tác",
            headerClassName: "px-4 py-3",
            cellClassName: "px-4 py-3 text-right",
            render: (row: ExamResultRow) => (
              <button
                type="button"
                title="Xem / chấm điểm"
                onClick={() => onGrade(row)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4 [&_svg]:w-4"
              >
                <EyeOutlined />
              </button>
            ),
          } as TableColumn<ExamResultRow>,
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm kiếm học viên..."
      />
      <Table
        columns={columns}
        data={filtered}
        rowKey={(row) => row.registration_id}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        errorMessage="Không tải được kết quả bài kiểm tra"
        emptyText="Chưa có học viên đăng ký dự thi"
        minWidthClassName="min-w-200"
      />
    </div>
  );
};

export default StudentResultTable;
