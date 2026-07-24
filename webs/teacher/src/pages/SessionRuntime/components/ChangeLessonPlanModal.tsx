import { useEffect, useMemo, useState } from "react";
import { notification, Select } from "tera-dls";

import FormScaff from "@tera/components/dof/FormScaff";
import FieldLabel from "_common/components/FieldLabel";
import useConfirm from "_common/hooks/useConfirm";
import { LessonPlanService, LessonService } from "@tera/modules/education";
import { toLessonTemplateSummaries } from "pages/LessonPlan/_utils";
import type { LessonActivity } from "pages/Lesson/_interface";

interface PlanOption {
  id: number;
  plan_name: string;
}

interface ChangeLessonPlanModalProps {
  open: boolean;
  onClose: () => void;
  lessonId: number | null;
  currentPlanId?: number | null;
  currentLessonPlanLessonId?: number | null;
  availablePlans: PlanOption[];
  activities: LessonActivity[];
}

const ChangeLessonPlanModal = ({
  open,
  onClose,
  lessonId,
  currentPlanId,
  currentLessonPlanLessonId,
  availablePlans,
  activities,
}: ChangeLessonPlanModalProps) => {
  const confirm = useConfirm();
  const [planId, setPlanId] = useState<number | undefined>(undefined);
  const [lessonPlanLessonId, setLessonPlanLessonId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    setPlanId(currentPlanId ?? undefined);
    setLessonPlanLessonId(currentLessonPlanLessonId ?? undefined);
  }, [open, currentPlanId, currentLessonPlanLessonId]);

  const planDetailQuery = LessonPlanService.useLessonPlanDetail(
    { id: planId ?? "" },
    { enabled: !!planId },
  );
  const templates = useMemo(() => {
    const payload = planDetailQuery.data?.data;
    return toLessonTemplateSummaries((payload?.plan ?? payload)?.lessons);
  }, [planDetailQuery.data]);

  const { mutate: changePlan, isPending } = LessonService.useLessonChangePlan();

  const hasProgress = activities.some((a) => a.status !== "pending");

  const submit = () => {
    if (!lessonId || !planId) {
      notification.warning({ message: "Vui lòng chọn giáo án" });
      return;
    }
    changePlan(
      { id: lessonId, params: { lesson_plan_id: planId, lesson_plan_lesson_id: lessonPlanLessonId } },
      {
        onSuccess: () => {
          notification.success({ message: "Đã đổi giáo án / bài học" });
          onClose();
        },
        onError: (error: any) =>
          notification.error({ message: error?.data?.msg ?? "Không thể đổi giáo án / bài học" }),
      },
    );
  };

  const handleSubmit = () => {
    if (!hasProgress) {
      submit();
      return;
    }
    confirm.warning({
      title: "Đổi giáo án / bài học",
      content: (
        <p>
          Buổi học này đã có hoạt động đang diễn ra hoặc đã hoàn thành. Đổi sang bài học khác sẽ{" "}
          <b>xóa toàn bộ tiến trình hoạt động hiện tại</b> và thay bằng danh sách hoạt động của bài
          học mới. Tiếp tục?
        </p>
      ),
      onOk: submit,
    });
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit
      titleCreate="Đổi giáo án / bài học"
      titleEdit="Đổi giáo án / bài học"
      className="!w-[95%] xmd:!w-[460px]"
      okText="Lưu"
      onOk={handleSubmit}
      confirmLoading={isPending}
    >
      <div className="space-y-3">
        <div>
          <FieldLabel required>Giáo án</FieldLabel>
          <Select
            value={planId}
            placeholder="Chọn giáo án"
            options={availablePlans.map((p) => ({ value: p.id, label: p.plan_name }))}
            onChange={(v: any) => {
              setPlanId(v ?? undefined);
              setLessonPlanLessonId(undefined);
            }}
          />
        </div>
        {planId && (
          <div>
            <FieldLabel>Bài học</FieldLabel>
            <Select
              value={lessonPlanLessonId}
              loading={planDetailQuery.isLoading}
              placeholder="Tự động — bài học kế tiếp chưa dùng"
              allowClear
              options={templates.map((t) => ({
                value: t.id,
                label: `Bài ${t.lesson_no} — ${t.lesson_title}`,
              }))}
              onChange={(v: any) => setLessonPlanLessonId(v ?? undefined)}
            />
          </div>
        )}
        {hasProgress && (
          <p className="text-xs text-amber-600">
            Buổi học đã có hoạt động đang diễn ra/hoàn thành — đổi bài học sẽ đặt lại tiến trình.
          </p>
        )}
      </div>
    </FormScaff>
  );
};

export default ChangeLessonPlanModal;
