import moment from "moment";

import Badge from "_common/components/Badge";
import Table, { TableColumn } from "_common/components/Table";

interface StudentScoresPanelProps {
  evaluations: any[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

/**
 * The student's scored evaluations over time — sourced from the same
 * `target_id`-filtered evaluation list the overview already loads.
 */
const StudentScoresPanel = ({ evaluations, isLoading, isError, onRetry }: StudentScoresPanelProps) => {
  const rows = [...evaluations]
    .filter((e) => e.score != null)
    .sort((a, b) => String(b.evaluated_at ?? "").localeCompare(String(a.evaluated_at ?? "")));

  const columns: TableColumn<any>[] = [
    {
      key: "date",
      title: "Ngày đánh giá",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => (row.evaluated_at ? moment(row.evaluated_at).format("DD/MM/YYYY") : "—"),
    },
    {
      key: "period",
      title: "Kỳ đánh giá",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => row.evaluation_period_label || "—",
    },
    {
      key: "score",
      title: "Điểm",
      render: (row) => (
        <span className="font-semibold text-slate-800">{row.score}</span>
      ),
    },
    {
      key: "classification",
      title: "Xếp loại",
      render: (row) =>
        row.classification_label ? (
          <Badge className="bg-sky-50 px-2.5 py-0.5 text-[11px] text-brand">
            {row.classification_label}
          </Badge>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={rows}
      rowKey={(row) => row.id}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      errorMessage="Không tải được điểm số"
      emptyText="Chưa có điểm đánh giá nào"
      minWidthClassName="min-w-160"
    />
  );
};

export default StudentScoresPanel;
