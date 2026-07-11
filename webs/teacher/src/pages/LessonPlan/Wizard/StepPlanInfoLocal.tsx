import { useForm } from "react-hook-form";
import { Button } from "tera-dls";

import FormTera from "@tera/components/dof/FormTera";

import Card from "_common/components/Card";

import type { LessonPlanFormValues } from "../_interface";
import PlanInfoFields from "./components/PlanInfoFields";

interface StepPlanInfoLocalProps {
  values: LessonPlanFormValues;
  onNext: (values: LessonPlanFormValues) => void;
}

/**
 * Create wizard's step 1: nothing is persisted here — values are staged
 * locally and the plan is only created once every step is submitted together
 * at the end (see StepReviewCreate).
 */
const StepPlanInfoLocal = ({ values, onNext }: StepPlanInfoLocalProps) => {
  const form = useForm<LessonPlanFormValues>({ mode: "onChange", defaultValues: values });

  return (
    <Card>
      <FormTera form={form} onSubmit={form.handleSubmit(onNext)}>
        <PlanInfoFields form={form} />

        <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
          <Button htmlType="submit" className="bg-brand hover:bg-brand/80">
            Tiếp tục
          </Button>
        </div>
      </FormTera>
    </Card>
  );
};

export default StepPlanInfoLocal;
