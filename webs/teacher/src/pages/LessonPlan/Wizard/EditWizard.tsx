import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Button, Spin } from "tera-dls";

import { LessonPlanService } from "@tera/modules/education";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import { PATHS } from "_common/components/Layout/Menu/menus";

import type { LessonPlan } from "../_interface";
import { toLessonPlan } from "../_utils";

import { STEP_LABELS } from "./constants";
import WizardSteps from "./components/WizardSteps";
import StepPlanInfo from "./StepPlanInfo";
import StepLessonTemplates from "./StepLessonTemplates";
import StepMaterials from "./StepMaterials";
import StepReview from "./StepReview";

interface EditWizardProps {
  planId: number;
}

/**
 * Editing an existing plan: the plan (and possibly its lessons/materials)
 * already exist, so every step saves to the API immediately.
 */
const EditWizard = observer(({ planId: routePlanId }: EditWizardProps) => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [planId, setPlanId] = useState<number>(routePlanId);
  // How far the flow has been unlocked; steps before this are shown as done.
  const [maxStep, setMaxStep] = useState(4);

  const planQuery = LessonPlanService.useLessonPlanDetail({ id: planId });
  const plan: LessonPlan | null = useMemo(() => {
    const payload = planQuery.data?.data;
    if (!payload) return null;
    return toLessonPlan(payload.plan ?? payload);
  }, [planQuery.data]);

  const completedSteps = useMemo(
    () => Array.from({ length: Math.max(maxStep - 1, 0) }, (_, i) => i + 1),
    [maxStep],
  );

  const goToStep = (target: number) => setStep(target);

  const advance = (target: number) => {
    setMaxStep((prev) => Math.max(prev, target));
    setStep(target);
  };

  const handlePlanSaved = (savedId: number) => {
    setPlanId(savedId);
    advance(2);
  };

  const isPublished = plan?.status === "published";

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Giáo án", onClick: () => navigate(PATHS.lessonPlans) },
          { label: "Chỉnh sửa giáo án" },
        ]}
      />

      {planQuery.isLoading ? (
        <Card>
          <Spin spinning>
            <div className="h-[30vh]" />
          </Spin>
        </Card>
      ) : isPublished ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm font-medium text-slate-700">
              Giáo án <b>{plan?.plan_name}</b> đã xuất bản, không thể chỉnh sửa trực
              tiếp.
            </p>
            <p className="text-xs text-slate-400">
              Liên hệ quản trị viên nếu cần thay đổi nội dung đã xuất bản.
            </p>
            <Button
              outlined
              onClick={() => navigate(`${PATHS.lessonPlans}/${planId}`)}
              className="mt-2 text-slate-600 border-slate-200 hover:bg-slate-50"
            >
              Về chi tiết giáo án
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <WizardSteps
            currentStep={step}
            steps={STEP_LABELS}
            completedSteps={completedSteps}
            onStepClick={goToStep}
          />

          {step === 1 && <StepPlanInfo plan={plan} onSaved={handlePlanSaved} />}

          {step === 2 && (
            <StepLessonTemplates
              planId={planId}
              onBack={() => setStep(1)}
              onNext={() => advance(3)}
            />
          )}

          {step === 3 && (
            <StepMaterials
              planId={planId}
              onBack={() => setStep(2)}
              onNext={() => advance(4)}
            />
          )}

          {step === 4 && <StepReview planId={planId} onBack={() => setStep(3)} />}
        </>
      )}
    </div>
  );
});

export default EditWizard;
