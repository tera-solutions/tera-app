import { useEffect, useMemo, useState } from "react";

import Card from "_common/components/Card";
import { CourseService } from "@tera/modules/education";
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
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
  const [pricing, setPricing] = useState<EnrollmentPricing>(DEFAULT_PRICING);
  const [pricingConfirmed, setPricingConfirmed] = useState(false);
  const [students, setStudents] = useState<EnrollmentDraftStudent[]>([]);

  // Seed the pricing step with the class's own course price instead of a
  // generic default — the presets in StepPricing are local UI sugar with no
  // backend catalog behind them, but `edu_courses.price_per_lesson` is real.
  const courseQuery = CourseService.useCourseDetail(
    { id: selectedClass?.course_id ?? "" },
    { enabled: !!selectedClass?.course_id },
  );
  useEffect(() => {
    const coursePrice = courseQuery.data?.data?.course?.price_per_lesson;
    if (!pricingConfirmed && coursePrice != null) {
      setPricing((prev) => ({ ...prev, price_per_lesson: Number(coursePrice) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseQuery.data, selectedClass?.id]);

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
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800">Ghi danh học viên</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Đăng ký học viên vào lớp học và chọn gói dịch vụ
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

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        <div>
          {step === 1 && (
            <Card>
              <StepSelectClass
                selectedClass={selectedClass}
                onNext={(classroom) => {
                  setSelectedClass(classroom);
                  advance(2);
                }}
              />
            </Card>
          )}

          {step === 2 && (
            <StepPricing
              values={pricing}
              onBack={() => setStep(1)}
              onNext={(values) => {
                setPricing(values);
                setPricingConfirmed(true);
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
          pricing={pricingConfirmed ? pricing : null}
          studentCount={students.length}
        />
      </div>
    </div>
  );
};

export default Enrollment;
