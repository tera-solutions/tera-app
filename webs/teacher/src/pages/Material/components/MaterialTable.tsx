import moment from "moment";
import { DocumentOutlined, EyeOutlined, TrashOutlined } from "tera-dls";

import IconBox from "_common/components/IconBox";
import Table, { TableColumn } from "_common/components/Table";
import TableRowActions from "_common/components/TableRowActions";

import type { MaterialRow } from "../_interface";
import { MATERIAL_TYPE_BADGE, MATERIAL_TYPE_LABELS } from "../constants";
import { formatFileSize } from "../_utils";

interface MaterialTableProps {
  items: MaterialRow[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onView: (row: MaterialRow) => void;
  onDelete: (row: MaterialRow) => void;
}

const MaterialTable = ({ items, loading, isError, onRetry, onView, onDelete }: MaterialTableProps) => {
  const columns: TableColumn<MaterialRow>[] = [
    {
      key: "name",
      title: "Tên tài liệu",
      render: (row) => (
        <div className="flex items-center gap-3">
          <IconBox
            icon={<DocumentOutlined />}
            sizeClassName="h-9 w-9"
            roundedClassName="rounded-lg"
            colorClassName={MATERIAL_TYPE_BADGE[row.type]}
            iconSizeClassName="[&_svg]:h-4.5 [&_svg]:w-4.5"
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-800">{row.name}</p>
            <p className="truncate text-xs text-slate-400">
              {MATERIAL_TYPE_LABELS[row.type]}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      title: "Thư mục",
      render: (row) => row.categoryName ?? "—",
    },
    {
      key: "size",
      title: "Dung lượng",
      render: (row) => formatFileSize(row.fileSize),
    },
    {
      key: "updated",
      title: "Cập nhật",
      render: (row) => (
        <div>
          <p>{row.updatedAt ? moment(row.updatedAt).format("DD/MM/YYYY HH:mm") : "—"}</p>
        </div>
      ),
    },
    {
      key: "actions",
      title: "",
      headerClassName: "w-20",
      render: (row) => (
        <TableRowActions
          buttons={[{ title: "Xem", icon: <EyeOutlined />, onClick: () => onView(row) }]}
          menuItems={[
            { key: "delete", label: "Xóa tài liệu", icon: <TrashOutlined />, onClick: () => onDelete(row) },
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
      errorMessage="Không tải được danh sách tài liệu"
      emptyText="Không có tài liệu phù hợp"
      minWidthClassName="min-w-160"
      onRowClick={onView}
    />
  );
};

export default MaterialTable;
