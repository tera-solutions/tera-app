import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, DocumentTextOutlined, Spin } from "tera-dls";

import { LessonPlanService } from "@tera/modules/education";
import { PATHS } from "_common/components/Layout/Menu/menus";

import Card from "_common/components/Card";
import ErrorRetry from "_common/components/ErrorRetry";
import StatisticCard from "_common/components/StatisticCard";
import StatusBadge from "_common/components/StatusBadge";

import { LESSON_PLAN_STATUS_META } from "../constants";
import { toLessonPlan } from "../_utils";
import { toWizardTemplates } from "./_utils";

interface StepReviewProps {
  planId: number;
  onBack: () => void;
}

/**
 * Teachers can only save/edit drafts here — publishing is an admin review
 * step (see `lesson_plan.publish` in RolePermissionSeeder), so there's no
 * publish action in this portal.
 */
const StepReview = ({ planId, onBack }: StepReviewProps) => {
  const navigate = useNavigate();
  const planQuery = LessonPlanService.useLessonPlanDetail({ id: planId });
  const { isLoading, isError, refetch } = planQuery;

  const payload = planQuery.data?.data;
  const plan = useMemo(
    () => (payload ? toLessonPlan(payload.plan ?? payload) : undefined),
    [payload],
  );
  const templates = useMemo(
    () => toWizardTemplates((payload?.plan ?? payload)?.lessons),
    [payload],
  );

  const totalDuration = templates.reduce((sum, t) => sum + (t.duration ?? 0), 0);
  const totalActivities = templates.reduce((sum, t) => sum + t.activities.length, 0);
  const totalMaterials = templates.reduce((sum, t) => sum + t.materials.length, 0);

  if (isError) {
    return (
      <Card>
        <div className="flex h-[30vh] items-center justify-center">
          <ErrorRetry onRetry={() => refetch()} message="Không tải được giáo án" />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Spin spinning={isLoading}>
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sky-50 text-brand [&_svg]:h-6 [&_svg]:w-6">
            {plan?.avatar ? (
              <img src={plan.avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <DocumentTextOutlined />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-base font-bold text-slate-800">
                {plan?.plan_name || "Giáo án"}
              </p>
              {plan && <StatusBadge name={LESSON_PLAN_STATUS_META} value={plan.status} />}
            </div>
            <p className="mt-1 truncate text-xs text-slate-500">
              {[plan?.plan_code, plan?.course_name, plan?.level_name]
                .filter(Boolean)
                .join(" • ")}
            </p>
            {plan?.description && (
              <p className="mt-1 truncate text-xs text-slate-400">
                {plan.description}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatisticCard
            icon={<DocumentTextOutlined />}
            value={templates.length}
            label="Buổi học"
            sublabel="Tổng số"
            iconClassName="bg-sky-50 text-brand"
          />
          <StatisticCard
            icon={<DocumentTextOutlined />}
            value={totalDuration}
            label="Thời lượng"
            sublabel="Phút"
            iconClassName="bg-amber-50 text-amber-500"
          />
          <StatisticCard
            icon={<DocumentTextOutlined />}
            value={totalActivities}
            label="Hoạt động"
            sublabel="Tổng số"
            iconClassName="bg-emerald-50 text-emerald-500"
          />
          <StatisticCard
            icon={<DocumentTextOutlined />}
            value={totalMaterials}
            label="Tài liệu"
            sublabel="Đã đính kèm"
            iconClassName="bg-violet-50 text-violet-500"
          />
        </div>

        <div className="flex flex-col divide-y divide-slate-100 rounded-xl border border-slate-100">
          {templates.map((template, index) => (
            <div key={template.id} className="flex items-center gap-3 p-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-semibold text-brand">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">
                  {template.lesson_title || "—"}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {template.duration ? `${template.duration} phút` : ""}
                </p>
              </div>
              <span className="shrink-0 text-xs text-slate-400">
                {template.activities.length} hoạt động • {template.materials.length}{" "}
                tài liệu
              </span>
            </div>
          ))}

          {templates.length === 0 && (
            <p className="p-4 text-center text-sm text-slate-400">
              Giáo án chưa có buổi học nào.
            </p>
          )}
        </div>
      </Spin>

      {plan?.status !== "published" && (
        <p className="mt-4 text-xs text-slate-400">
          Giáo án đang ở trạng thái nháp. Quản trị viên sẽ xem xét và xuất bản.
        </p>
      )}

      <div className="mt-2 flex justify-between gap-2 border-t border-slate-100 pt-4">
        <Button
          outlined
          onClick={onBack}
          className="text-slate-600 border-slate-200 hover:bg-slate-50"
        >
          Quay lại
        </Button>
        <Button
          outlined
          onClick={() => navigate(PATHS.lessonPlans)}
          className="text-slate-600 border-slate-200 hover:bg-slate-50"
        >
          Về danh sách giáo án
        </Button>
      </div>
    </Card>
  );
};

export default StepReview;
