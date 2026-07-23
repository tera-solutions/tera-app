import moment from "moment";
import {
  ArchiveBoxOutlined,
  CheckBadgeOutlined,
  DocumentTextOutlined,
  Dropdown,
  EllipsisVerticalOutlined,
  EyeOutlined,
  PencilSquareOutlined,
} from "tera-dls";

import Avatar from "_common/components/Avatar";
import AvatarListPanel from "_common/components/AvatarListPanel";
import StatusBadge from "_common/components/StatusBadge";

import type { LessonPlan } from "../_interface";
import { LESSON_PLAN_STATUS_META } from "../constants";

interface LessonPlanTableProps {
  plans: LessonPlan[];
  loading?: boolean;
  fetching?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onView: (plan: LessonPlan) => void;
  onEdit: (plan: LessonPlan) => void;
  onArchive: (plan: LessonPlan) => void;
  onPublish: (plan: LessonPlan) => void;
}

const LessonPlanTable = ({
  plans,
  loading,
  fetching,
  isError,
  onRetry,
  onView,
  onEdit,
  onArchive,
  onPublish,
}: LessonPlanTableProps) => {
  return (
    <AvatarListPanel
      items={plans}
      rowKey={(plan) => plan.id}
      loading={loading}
      fetching={fetching}
      isError={isError}
      onRetry={onRetry}
      errorMessage="Không tải được danh sách giáo án"
      emptyText="Chưa có giáo án nào"
      onRowClick={onView}
      renderRow={(plan) => (
        <>
          <Avatar
            src={plan.avatar}
            alt={plan.plan_name}
            sizeClassName="h-11 w-11"
            fallbackIcon={<DocumentTextOutlined />}
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">
              {plan.plan_name || "—"}
            </p>
            <p className="truncate text-xs text-slate-400">
              {[
                plan.plan_code,
                plan.course_name,
                `v${plan.version}`,
                `${plan.total_lessons} bài học`,
              ]
                .filter(Boolean)
                .join(" • ")}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <StatusBadge name={LESSON_PLAN_STATUS_META} value={plan.status} />
            {plan.updated_at && (
              <p className="mt-1 text-[11px] text-slate-400">
                {moment(plan.updated_at, "YYYY-MM-DD").format("DD/MM/YYYY")}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {plan.status !== "published" && (
              <button
                type="button"
                title="Sửa"
                onClick={() => onEdit(plan)}
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
                    label: "Xem chi tiết giáo án",
                    icon: <EyeOutlined />,
                    onClick: () => onView(plan),
                  },
                  ...(plan.status === "draft" || plan.status === "reviewing"
                    ? [
                        {
                          key: "publish",
                          label: "Xuất bản",
                          icon: <CheckBadgeOutlined />,
                          onClick: () => onPublish(plan),
                        },
                      ]
                    : []),
                  ...(plan.status !== "archived"
                    ? [
                        {
                          key: "archive",
                          label: "Ngừng sử dụng",
                          icon: <ArchiveBoxOutlined />,
                          onClick: () => onArchive(plan),
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

export default LessonPlanTable;
