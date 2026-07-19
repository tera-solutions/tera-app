import {
  ArrowPathOutlined,
  ArchiveBoxOutlined,
  Dropdown,
  EllipsisVerticalOutlined,
  EyeOutlined,
  PencilSquareOutlined,
  Spin,
} from "tera-dls";

import Avatar from "_common/components/Avatar";
import EmptyState from "_common/components/EmptyState";
import ErrorRetry from "_common/components/ErrorRetry";
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
}: TeacherTableProps) => {
  const { getLabel } = useMeta();

  if (isError)
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <ErrorRetry onRetry={onRetry} message="Không tải được danh sách giáo viên" iconClassName="h-7 w-7" />
      </div>
    );

  if (loading && items.length === 0)
    return (
      <Spin spinning>
        <div className="h-[40vh]" />
      </Spin>
    );

  if (!loading && items.length === 0)
    return <EmptyState classNameImage="w-32 mx-auto" description="Chưa có giáo viên nào" />;

  return (
    <Spin spinning={loading || fetching}>
      <div className="flex flex-col divide-y divide-slate-100">
        {items.map((teacher) => (
          <div
            key={teacher.id}
            role="button"
            tabIndex={0}
            onClick={() => onView(teacher)}
            onKeyDown={(e) => e.key === "Enter" && onView(teacher)}
            className="flex cursor-pointer items-center gap-3 py-3 hover:bg-slate-50"
          >
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
          </div>
        ))}
      </div>
    </Spin>
  );
};

export default TeacherTable;
