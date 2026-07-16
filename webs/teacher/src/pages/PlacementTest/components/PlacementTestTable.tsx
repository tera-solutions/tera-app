import moment from "moment";
import { PencilSquareOutlined, PlayCircleOutlined, TrashOutlined } from "tera-dls";

import Badge from "_common/components/Badge";
import Table, { TableColumn } from "_common/components/Table";
import TableRowActions from "_common/components/TableRowActions";

import type { PlacementTestRow } from "../_interface";
import { PLACEMENT_TEST_STATUS_BADGE, PLACEMENT_TEST_STATUS_LABELS, SKILL_LABELS } from "../constants";

interface PlacementTestTableProps {
  items: PlacementTestRow[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onEdit: (row: PlacementTestRow) => void;
  onPublish: (row: PlacementTestRow) => void;
  onDelete: (row: PlacementTestRow) => void;
}

const PlacementTestTable = ({
  items,
  loading,
  isError,
  onRetry,
  onEdit,
  onPublish,
  onDelete,
}: PlacementTestTableProps) => {
  const columns: TableColumn<PlacementTestRow>[] = [
    {
      key: "title",
      title: "Tên bài kiểm tra",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.title}</p>
          <p className="text-xs text-slate-400">
            {row.skills.map((s) => SKILL_LABELS[s] ?? s).join(", ") || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "level",
      title: "Trình độ",
      render: (row) =>
        row.cefrLevel ? (
          <Badge className="bg-sky-50 px-2.5 py-1 text-xs font-semibold text-brand">{row.cefrLevel}</Badge>
        ) : (
          "—"
        ),
    },
    { key: "questions", title: "Số câu hỏi", render: (row) => row.questionCount },
    { key: "duration", title: "Thời gian", render: (row) => `${row.durationMinutes} phút` },
    { key: "attempts", title: "Lượt làm", render: (row) => row.attempts },
    { key: "avg", title: "Điểm TB", render: (row) => row.avgScore ?? "—" },
    {
      key: "completion",
      title: "Tỷ lệ hoàn thành",
      render: (row) => (
        <div className="w-24">
          <div className="h-1.5 w-full rounded-full bg-slate-100">
            <div
              className="h-1.5 rounded-full bg-brand"
              style={{ width: `${Math.min(row.completionRate, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">{row.completionRate}%</p>
        </div>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => (
        <Badge className={`px-2.5 py-1 text-xs ${PLACEMENT_TEST_STATUS_BADGE[row.status]}`}>
          {PLACEMENT_TEST_STATUS_LABELS[row.status]}
        </Badge>
      ),
    },
    {
      key: "created",
      title: "Ngày tạo",
      render: (row) => (row.createdAt ? moment(row.createdAt).format("DD/MM/YYYY") : "—"),
    },
    {
      key: "actions",
      title: "",
      headerClassName: "w-24",
      render: (row) => (
        <TableRowActions
          buttons={[{ title: "Sửa", icon: <PencilSquareOutlined />, onClick: () => onEdit(row) }]}
          menuItems={[
            ...(row.status === "draft"
              ? [{ key: "publish", label: "Xuất bản", icon: <PlayCircleOutlined />, onClick: () => onPublish(row) }]
              : []),
            { key: "delete", label: "Xóa bài kiểm tra", icon: <TrashOutlined />, onClick: () => onDelete(row) },
          ]}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={items}
      rowKey={(row) => row.id}
      isLoading={loading}
      isError={isError}
      onRetry={onRetry}
      errorMessage="Không tải được danh sách bài kiểm tra"
      emptyText="Chưa có bài kiểm tra nào"
      minWidthClassName="min-w-220"
    />
  );
};

export default PlacementTestTable;
