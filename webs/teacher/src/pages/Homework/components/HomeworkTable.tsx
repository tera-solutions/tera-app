import { useNavigate } from "react-router-dom";
import moment from "moment";
import classNames from "classnames";
import { Dropdown, EllipsisVerticalOutlined, PencilSquareOutlined, TrashOutlined } from "tera-dls";

import Table, { TableColumn } from "_common/components/Table";
import StatusBadge from "_common/components/StatusBadge";
import { PATHS } from "_common/components/Layout/Menu/menus";

import type { Homework } from "../_interface";
import { ASSIGNMENT_STATUS_META } from "../constants";
import { isOverdue } from "../_utils";

interface HomeworkTableProps {
  data: Homework[];
  submittedCounts: Record<number, number>;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onEdit: (item: Homework) => void;
  onDelete: (item: Homework) => void;
}

const HomeworkTable = ({
  data,
  submittedCounts,
  isLoading,
  isError,
  onRetry,
  onEdit,
  onDelete,
}: HomeworkTableProps) => {
  const navigate = useNavigate();

  const columns: TableColumn<Homework>[] = [
    {
      key: "name",
      title: "Tên bài tập",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-700">{row.name}</p>
          <p className="text-xs text-slate-400">{row.code}</p>
        </div>
      ),
    },
    {
      key: "class",
      title: "Lớp",
      render: (row) => <span className="text-slate-600">{row.class_name || "—"}</span>,
    },
    {
      key: "due_date",
      title: "Hạn nộp",
      render: (row) =>
        row.due_date ? (
          <span
            className={classNames(
              "text-sm",
              isOverdue(row.due_date) ? "font-medium text-red-500" : "text-slate-600",
            )}
          >
            {moment(row.due_date).format("DD/MM/YYYY HH:mm")}
          </span>
        ) : (
          "—"
        ),
    },
    {
      key: "student_count",
      title: "Số HV",
      render: (row) => <span className="text-slate-600">{row.student_count}</span>,
    },
    {
      key: "submitted",
      title: "Đã nộp",
      render: (row) => {
        const submitted = submittedCounts[row.id] ?? 0;
        const rate = row.student_count ? Math.round((submitted / row.student_count) * 100) : 0;
        return (
          <div className="min-w-24">
            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
              <span>
                {submitted}/{row.student_count}
              </span>
              <span>{rate}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: `${rate}%` }} />
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => <StatusBadge name={ASSIGNMENT_STATUS_META} value={row.status} />,
    },
    {
      key: "actions",
      title: "Thao tác",
      headerClassName: "px-4 py-3 text-right",
      cellClassName: "px-4 py-3 text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            title="Chấm bài"
            onClick={() => navigate(`${PATHS.grading}/${row.id}`)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4 [&_svg]:w-4"
          >
            <PencilSquareOutlined />
          </button>
          <Dropdown
            trigger="click"
            menu={{
              itemClassName: "text-slate-700 hover:bg-brand! hover:text-white!",
              items: [
                {
                  key: "edit",
                  label: "Sửa",
                  icon: <PencilSquareOutlined />,
                  onClick: () => onEdit(row),
                },
                {
                  key: "delete",
                  label: "Xóa",
                  icon: <TrashOutlined />,
                  onClick: () => onDelete(row),
                },
              ],
            }}
          >
            <button
              type="button"
              title="Thêm"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 [&_svg]:h-4 [&_svg]:w-4"
            >
              <EllipsisVerticalOutlined />
            </button>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      rowKey={(row) => row.id}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      errorMessage="Không tải được danh sách bài tập"
      emptyText="Chưa có bài tập nào"
      minWidthClassName="min-w-180"
    />
  );
};

export default HomeworkTable;
