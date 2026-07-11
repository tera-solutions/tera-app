import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, notification, Spin } from "tera-dls";

import FormTera from "@tera/components/dof/FormTera";
import { LessonPlanService } from "@tera/modules/education";

import Card from "_common/components/Card";

import type { LessonPlan, LessonPlanFormValues } from "../_interface";
import PlanInfoFields from "./components/PlanInfoFields";

interface StepPlanInfoProps {
  plan: LessonPlan | null;
  onSaved: (planId: number) => void;
}

/** Edit wizard's step 1: the plan already exists, so saving updates it immediately. */
const StepPlanInfo = ({ plan, onSaved }: StepPlanInfoProps) => {
  const isEdit = !!plan;
  const form = useForm<LessonPlanFormValues>({ mode: "onChange" });

  const { mutate: upsert, isPending } = LessonPlanService.useUpsertLessonPlan();

  useEffect(() => {
    form.reset({
      plan_code: plan?.plan_code ?? "",
      plan_name: plan?.plan_name ?? "",
      avatar: plan?.avatar ?? "",
      course_id: plan?.course_id ?? null,
      level_id: plan?.level_id ?? null,
      description: plan?.description ?? "",
    });
  }, [plan]);

  const handleSubmit = (values: LessonPlanFormValues) => {
    // Update rejects `course_id` (immutable once created) — only send it on create.
    const params: Record<string, unknown> = {
      plan_code: values.plan_code,
      plan_name: values.plan_name,
      avatar: values.avatar || undefined,
      level_id: values.level_id || undefined,
      description: values.description ?? "",
      ...(isEdit ? {} : { course_id: values.course_id }),
    };

    upsert(
      { id: plan?.id, params },
      {
        onSuccess: (res: any) => {
          notification.success({
            message: res?.msg ?? "Lưu giáo án thành công",
          });
          const savedId = res?.data?.id ?? plan?.id;
          if (savedId) onSaved(Number(savedId));
        },
        onError: (err: any) => {
          notification.error({
            message: err?.msg ?? err?.message ?? "Lưu giáo án thất bại",
          });
        },
      },
    );
  };

  return (
    <Card>
      <Spin spinning={isPending}>
        <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
          <PlanInfoFields form={form} disableImmutable={isEdit} />

          <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
            <Button
              htmlType="submit"
              loading={isPending}
              className="bg-brand hover:bg-brand/80"
            >
              Tiếp tục
            </Button>
          </div>
        </FormTera>
      </Spin>
    </Card>
  );
};

export default StepPlanInfo;
