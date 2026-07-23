import {
  ArrowPathOutlined,
  ArchiveBoxOutlined,
  BanknotesOutlined,
  CurrencyDollarOutlined,
  Dropdown,
  EllipsisVerticalOutlined,
  EyeOutlined,
  PencilSquareOutlined,
} from "tera-dls";

import Avatar from "_common/components/Avatar";
import AvatarListPanel from "_common/components/AvatarListPanel";
import StatusBadge from "_common/components/StatusBadge";
import { useMeta } from "_common/hooks/useMeta";

import type { Teacher } from "../_interface";
import { TEACHER_STATUS_META, TEACHER_TYPE_META } from "../constants";
import { formatVnd } from "../_utils";

interface TeacherTableProps {
  items: Teacher[];
  loading?: boolean;
  fetching?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onView: (teacher: Teacher) => void;
  onEdit: (teacher: Teacher) => void;
  onSuspend: (teacher: Teacher) => void;
  onRestore: (teacher: Teacher) => void;
  onAdjustWallet: (teacher: Teacher) => void;
  onPayroll: (teacher: Teacher) => void;
}

const TeacherTable = ({
  items,
  loading,
  fetching,
  isError,
  onRetry,
  onView,
  onEdit,
  onSuspend,
  onRestore,
  onAdjustWallet,
  onPayroll,
}: TeacherTableProps) => {
  const { getLabel } = useMeta();

  return (
    <AvatarListPanel
      items={items}
      rowKey={(teacher) => teacher.id}
      loading={loading}
      fetching={fetching}
      isError={isError}
      onRetry={onRetry}
      errorMessage="Không tải được danh sách giáo viên"
      emptyText="Chưa có giáo viên nào"
      onRowClick={onView}
      renderRow={(teacher) => (
        <>
          <Avatar src={teacher.avatar} alt={teacher.fullName} sizeClassName="h-11 w-11" />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">{teacher.fullName || "—"}</p>
            <p className="truncate text-xs text-slate-400">
              {[teacher.code, getLabel(TEACHER_TYPE_META, teacher.teacherType), teacher.branchName]
                .filter(Boolean)
                .join(" • ")}
            </p>
          </div>

          <div className="hidden shrink-0 text-right sm:block">
            <p className="text-sm font-medium text-slate-700">{formatVnd(teacher.hourlyRate)}</p>
            <p className="text-[11px] text-slate-400">/giờ</p>
          </div>

          <div className="shrink-0">
            <StatusBadge name={TEACHER_STATUS_META} value={teacher.status} />
          </div>

          <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {teacher.status !== "resigned" && (
              <button
                type="button"
                title="Sửa"
                onClick={() => onEdit(teacher)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
              >
                <PencilSquareOutlined />
              </button>
            )}
            <Dropdown
              trigger="click"
              menu={{
                itemClassName: "text-slate-700 hover:bg-brand! hover:text-white!",
                items: [
                  {
                    key: "view",
                    label: "Xem chi tiết",
                    icon: <EyeOutlined />,
                    onClick: () => onView(teacher),
                  },
                  {
                    key: "adjust-wallet",
                    label: "Cập nhật số dư",
                    icon: <BanknotesOutlined />,
                    onClick: () => onAdjustWallet(teacher),
                  },
                  {
                    key: "payroll",
                    label: "Trả lương",
                    icon: <CurrencyDollarOutlined />,
                    onClick: () => onPayroll(teacher),
                  },
                  ...(teacher.status === "active"
                    ? [
                        {
                          key: "suspend",
                          label: "Tạm ngưng",
                          icon: <ArchiveBoxOutlined />,
                          onClick: () => onSuspend(teacher),
                        },
                      ]
                    : []),
                  ...(teacher.status === "suspended"
                    ? [
                        {
                          key: "restore",
                          label: "Khôi phục",
                          icon: <ArrowPathOutlined />,
                          onClick: () => onRestore(teacher),
                        },
                      ]
                    : []),
                ],
              }}
            >
              <button
                type="button"
                title="Thêm"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 [&_svg]:h-5 [&_svg]:w-5"
              >
                <EllipsisVerticalOutlined />
              </button>
            </Dropdown>
          </div>
        </>
      )}
    />
  );
};

export default TeacherTable;
