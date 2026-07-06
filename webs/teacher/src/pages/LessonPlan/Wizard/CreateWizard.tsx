import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Breadcrumb from "_common/components/Breadcrumb";
import { PATHS } from "_common/components/Layout/Menu/menus";

import type { LessonPlanFormValues } from "../_interface";

import { STEP_LABELS } from "./constants";
import type { WizardLessonTemplate } from "./_interface";
import WizardSteps from "./components/WizardSteps";
import StepPlanInfoLocal from "./StepPlanInfoLocal";
import StepLessonTemplatesLocal from "./StepLessonTemplatesLocal";
import StepMaterialsLocal from "./StepMaterialsLocal";
import StepReviewCreate from "./StepReviewCreate";

const EMPTY_PLAN_VALUES: LessonPlanFormValues = {
  plan_code: "",
  plan_name: "",
  avatar: "",
  course_id: null,
  level_id: null,
  description: "",
};

/**
 * Creating a new plan: nothing is persisted until every step has been filled
 * in and the final review step submits the whole plan (info + lesson
 * templates + activities + materials) in one go.
 */
const CreateWizard = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [planValues, setPlanValues] = useState<LessonPlanFormValues>(EMPTY_PLAN_VALUES);
  const [templates, setTemplates] = useState<WizardLessonTemplate[]>([]);

  const completedSteps = useMemo(
    () => Array.from({ length: Math.max(maxStep - 1, 0) }, (_, i) => i + 1),
    [maxStep],
  );

  const advance = (target: number) => {
    setMaxStep((prev) => Math.max(prev, target));
    setStep(target);
  };

  // All 4 steps are just local form state until the final submit, so every
  // step is freely revisitable once reached once.
  const goToStep = (target: number) => {
    if (target <= maxStep) setStep(target);
  };

  const handlePlanInfoNext = (values: LessonPlanFormValues) => {
    setPlanValues(values);
    advance(2);
  };

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Giáo án", onClick: () => navigate(PATHS.lessonPlans) },
          { label: "Soạn giáo án" },
        ]}
      />

      <WizardSteps
        currentStep={step}
        steps={STEP_LABELS}
        completedSteps={completedSteps}
        onStepClick={goToStep}
      />

      {step === 1 && (
        <StepPlanInfoLocal values={planValues} onNext={handlePlanInfoNext} />
      )}

      {step === 2 && (
        <StepLessonTemplatesLocal
          templates={templates}
          onChange={setTemplates}
          onBack={() => setStep(1)}
          onNext={() => advance(3)}
        />
      )}

      {step === 3 && (
        <StepMaterialsLocal
          templates={templates}
          onChange={setTemplates}
          onBack={() => setStep(2)}
          onNext={() => advance(4)}
        />
      )}

      {step === 4 && (
        <StepReviewCreate
          planValues={planValues}
          templates={templates}
          onBack={() => setStep(3)}
        />
      )}
    </div>
  );
};

export default CreateWizard;
