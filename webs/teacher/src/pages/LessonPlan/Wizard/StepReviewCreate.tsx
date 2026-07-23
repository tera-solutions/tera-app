import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, DocumentTextOutlined, notification } from "tera-dls";

import {
  LessonPlanLessonService,
  LessonPlanService,
  MaterialService,
} from "@tera/modules/education";
import { PATHS } from "_common/components/Layout/Menu/menus";

import Card from "_common/components/Card";
import StatisticCard from "_common/components/StatisticCard";

import type { LessonPlanFormValues } from "../_interface";
import type { WizardLessonTemplate } from "./_interface";
import { toTemplateParams } from "./_utils";

interface StepReviewCreateProps {
  planValues: LessonPlanFormValues;
  templates: WizardLessonTemplate[];
  onBack: () => void;
}

/**
 * Create wizard's final step: nothing has been saved yet — this submits the
 * plan, every lesson template (with its activities), and every uploaded
 * material in one go. Teachers hold `lesson_plan.publish` (RolePermissionSeeder)
 * so they may publish immediately instead of only saving a draft.
 */
const StepReviewCreate = ({
  planValues,
  templates,
  onBack,
}: StepReviewCreateProps) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState<"draft" | "publish" | null>(null);

  const { mutateAsync: upsertPlan } = LessonPlanService.useUpsertLessonPlan();
  const { mutateAsync: createLesson } = LessonPlanLessonService.useLessonPlanLessonCreate();
  const { mutateAsync: attachMaterial } = MaterialService.useMaterialAttach();
  const { mutateAsync: publishPlan } = LessonPlanService.useLessonPlanPublish();

  const totalDuration = templates.reduce((sum, t) => sum + (t.duration ?? 0), 0);
  const totalActivities = templates.reduce((sum, t) => sum + t.activities.length, 0);
  const totalMaterials = templates.reduce((sum, t) => sum + t.materials.length, 0);

  const handleSubmit = async (publish: boolean) => {
    setSubmitting(publish ? "publish" : "draft");
    try {
      const planRes: any = await upsertPlan({
        id: undefined,
        params: {
          plan_code: planValues.plan_code,
          plan_name: planValues.plan_name,
          avatar: planValues.avatar || undefined,
          course_id: planValues.course_id,
          level_id: planValues.level_id || undefined,
          description: planValues.description ?? "",
        },
      });
      const planId = Number(planRes?.data?.id);

      for (const template of templates) {
        const lessonRes: any = await createLesson({
          id: planId,
          params: toTemplateParams(template),
        });
        const lessonId = lessonRes?.data?.id;

        for (const material of template.materials) {
          await attachMaterial({
            id: material.material_id,
            entity_type: "lesson",
            entity_id: lessonId,
          });
        }
      }

      if (publish) {
        await publishPlan({ id: planId, params: {} });
        notification.success({ message: "Tạo và xuất bản giáo án thành công." });
      } else {
        notification.success({
          message: "Đã lưu nháp giáo án. Bạn có thể xuất bản sau ở trang chi tiết.",
        });
      }
      navigate(`${PATHS.lessonPlans}/${planId}`);
    } catch (err: any) {
      notification.error({
        message: err?.msg ?? err?.message ?? "Tạo giáo án thất bại",
      });
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <Card>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sky-50 text-brand [&_svg]:h-6 [&_svg]:w-6">
          {planValues.avatar ? (
            <img src={planValues.avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            <DocumentTextOutlined />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-slate-800">
            {planValues.plan_name || "Giáo án"}
          </p>
          <p className="mt-1 truncate text-xs text-slate-500">
            {planValues.plan_code}
          </p>
          {planValues.description && (
            <p className="mt-1 truncate text-xs text-slate-400">
              {planValues.description}
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
          <div key={index} className="flex items-center gap-3 p-3">
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
              {template.activities.length} hoạt động • {template.materials.length} tài
              liệu
            </span>
          </div>
        ))}

        {templates.length === 0 && (
          <p className="p-4 text-center text-sm text-slate-400">
            Giáo án chưa có buổi học nào.
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Lưu nháp để chỉnh sửa thêm sau, hoặc xuất bản ngay để áp dụng giáo án cho lớp học.
      </p>

      <div className="mt-2 flex justify-between gap-2 border-t border-slate-100 pt-4">
        <Button
          outlined
          onClick={onBack}
          disabled={!!submitting}
          className="text-brand border-brand hover:bg-brand"
        >
          Quay lại
        </Button>
        <div className="flex gap-2">
          <Button
            outlined
            onClick={() => handleSubmit(false)}
            loading={submitting === "draft"}
            disabled={!!submitting}
            className="text-brand border-brand hover:bg-brand"
          >
            Lưu nháp
          </Button>
          <Button
            onClick={() => handleSubmit(true)}
            loading={submitting === "publish"}
            disabled={!!submitting}
            className="bg-brand hover:bg-brand/80"
          >
            Xuất bản
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StepReviewCreate;
