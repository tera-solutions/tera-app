import { useMemo, useState } from "react";

import Card from "_common/components/Card";
import type { Classroom } from "pages/Classroom/_interface";
import WizardSteps from "pages/LessonPlan/Wizard/components/WizardSteps";

import type { TransferEnrollmentRow } from "./_interface";
import { STEP_LABELS } from "./constants";
import StepSelectStudents from "./components/StepSelectStudents";
import StepSelectTargetClass from "./components/StepSelectTargetClass";
import StepConfirm from "./components/StepConfirm";

const Transfer = () => {
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedRows, setSelectedRows] = useState<TransferEnrollmentRow[]>([]);
  const [targetClass, setTargetClass] = useState<Classroom | null>(null);

  const completedSteps = useMemo(
    () => Array.from({ length: Math.max(maxStep - 1, 0) }, (_, i) => i + 1),
    [maxStep],
  );

  const advance = (target: number) => {
    setMaxStep((prev) => Math.max(prev, target));
    setStep(target);
  };
  const goToStep = (target: number) => {
    if (target <= maxStep) setStep(target);
  };

  const sourceCourseId = selectedRows[0]?.course_id ?? 0;
  const sourceClassIds = Array.from(new Set(selectedRows.map((r) => r.class_id)));

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800">Chuyển lớp</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Quản lý & chuyển học viên sang lớp học mới
        </p>
      </div>

      <Card className="mb-4">
        <WizardSteps
          currentStep={step}
          steps={STEP_LABELS}
          completedSteps={completedSteps}
          onStepClick={goToStep}
        />
      </Card>

      {step === 1 && (
        <Card>
          <StepSelectStudents
            selectedIds={selectedIds}
            onChange={setSelectedIds}
            onNext={(rows) => {
              setSelectedRows(rows);
              advance(2);
            }}
          />
        </Card>
      )}

      {step === 2 && (
        <Card>
          <StepSelectTargetClass
            courseId={sourceCourseId}
            excludeClassIds={sourceClassIds}
            targetClass={targetClass}
            onBack={() => setStep(1)}
            onNext={(target) => {
              setTargetClass(target);
              advance(3);
            }}
          />
        </Card>
      )}

      {step === 3 && targetClass && (
        <StepConfirm students={selectedRows} targetClass={targetClass} onBack={() => setStep(2)} />
      )}
    </div>
  );
};

export default Transfer;
