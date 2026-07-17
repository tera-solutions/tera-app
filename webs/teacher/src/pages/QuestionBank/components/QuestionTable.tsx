import moment from "moment";
import { EyeOutlined, PencilSquareOutlined, TrashOutlined } from "tera-dls";

import Badge from "_common/components/Badge";
import Table, { TableColumn } from "_common/components/Table";
import TableRowActions from "_common/components/TableRowActions";

import type { QuestionRow } from "../_interface";
import {
  QUESTION_DIFFICULTY_BADGE,
  QUESTION_DIFFICULTY_LABELS,
  QUESTION_SKILL_LABELS,
  QUESTION_TYPE_LABELS,
} from "../constants";

interface QuestionTableProps {
  items: QuestionRow[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onView: (row: QuestionRow) => void;
  onEdit: (row: QuestionRow) => void;
  onDelete: (row: QuestionRow) => void;
}

const QuestionTable = ({ items, loading, isError, onRetry, onView, onEdit, onDelete }: QuestionTableProps) => {
  const columns: TableColumn<QuestionRow>[] = [
    {
      key: "content",
      title: "Nội dung câu hỏi",
      render: (row) => (
        <div className="max-w-md">
          <p className="line-clamp-2 font-medium text-slate-800">{row.content}</p>
          <p className="mt-0.5 text-xs text-slate-400">{row.code}</p>
        </div>
      ),
    },
    { key: "skill", title: "Môn học", render: (row) => QUESTION_SKILL_LABELS[row.skill] ?? row.skill },
    { key: "type", title: "Dạng câu hỏi", render: (row) => QUESTION_TYPE_LABELS[row.type] ?? row.type },
    {
      key: "difficulty",
      title: "Độ khó",
      render: (row) => (
        <Badge className={`px-2.5 py-1 text-xs ${QUESTION_DIFFICULTY_BADGE[row.difficulty]}`}>
          {QUESTION_DIFFICULTY_LABELS[row.difficulty]}
        </Badge>
      ),
    },
    { key: "answers", title: "Đáp án", render: (row) => row.answersCount || "—" },
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
          buttons={[
            { title: "Xem", icon: <EyeOutlined />, onClick: () => onView(row) },
            { title: "Sửa", icon: <PencilSquareOutlined />, onClick: () => onEdit(row) },
          ]}
          menuItems={[
            { key: "delete", label: "Xóa câu hỏi", icon: <TrashOutlined />, onClick: () => onDelete(row) },
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
      errorMessage="Không tải được ngân hàng câu hỏi"
      emptyText="Không có câu hỏi phù hợp"
      minWidthClassName="min-w-180"
      onRowClick={onView}
    />
  );
};

export default QuestionTable;
