import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Breadcrumb from "_common/components/Breadcrumb";
import { PATHS } from "_common/components/Layout/Menu/menus";
import type { Classroom } from "pages/Classroom/_interface";
import WizardSteps from "pages/LessonPlan/Wizard/components/WizardSteps";

import type { EnrollmentDraftStudent, EnrollmentPricing } from "./_interface";
import { DEFAULT_PRICING, STEP_LABELS } from "./constants";
import EnrollmentSummarySidebar from "./components/EnrollmentSummarySidebar";
import StepSelectClass from "./components/StepSelectClass";
import StepPricing from "./components/StepPricing";
import StepStudents from "./components/StepStudents";
import StepConfirm from "./components/StepConfirm";

const Enrollment = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
  const [pricing, setPricing] = useState<EnrollmentPricing>(DEFAULT_PRICING);
  const [students, setStudents] = useState<EnrollmentDraftStudent[]>([]);

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

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Học viên", onClick: () => navigate(PATHS.students) },
          { label: "Ghi danh học viên" },
        ]}
      />

      <div className="mb-4 mt-2">
        <h1 className="text-xl font-bold text-slate-800">Ghi danh học viên</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Đăng ký học viên vào lớp học và chọn gói dịch vụ
        </p>
      </div>

      <WizardSteps
        currentStep={step}
        steps={STEP_LABELS}
        completedSteps={completedSteps}
        onStepClick={goToStep}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        <div>
          {step === 1 && (
            <StepSelectClass
              selectedClass={selectedClass}
              onNext={(classroom) => {
                setSelectedClass(classroom);
                advance(2);
              }}
            />
          )}

          {step === 2 && (
            <StepPricing
              values={pricing}
              onBack={() => setStep(1)}
              onNext={(values) => {
                setPricing(values);
                advance(3);
              }}
            />
          )}

          {step === 3 && (
            <StepStudents
              classroomName={selectedClass?.name ?? ""}
              students={students}
              onChange={setStudents}
              onBack={() => setStep(2)}
              onNext={() => advance(4)}
            />
          )}

          {step === 4 && selectedClass && (
            <StepConfirm
              classroom={selectedClass}
              pricing={pricing}
              students={students}
              onBack={() => setStep(3)}
            />
          )}
        </div>

        <EnrollmentSummarySidebar
          classroom={selectedClass}
          pricing={pricing}
          studentCount={students.length}
        />
      </div>
    </div>
  );
};

export default Enrollment;
