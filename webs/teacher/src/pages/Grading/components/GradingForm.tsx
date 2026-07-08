import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { notification } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import InputNumber from "@tera/components/dof/Control/InputNumber";
import TextArea from "@tera/components/dof/Control/TextArea";

import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";

import type { GradeFormValues, SubmissionDetail } from "../_interface";
import { isGraded } from "../_utils";
import { SubmissionService } from "@tera/modules/education";
import AISummaryPanel from "./AISummaryPanel";

interface GradingFormProps {
  submission: SubmissionDetail | undefined;
  maxScore: number;
  hasSelection: boolean;
  onGraded: () => void;
}

const GradingForm = ({ submission, maxScore, hasSelection, onGraded }: GradingFormProps) => {
  const form = useForm<GradeFormValues>({
    mode: "onChange",
    defaultValues: { score: 0, comment: "" },
  });

  useEffect(() => {
    form.reset({ score: submission?.score ?? 0, comment: submission?.comment ?? "" });
  }, [submission, form]);

  const { mutate: gradeSubmission, isPending: isGrading } = SubmissionService.useSubmissionGrade();
  const { mutate: updateSubmission, isPending: isUpdating } = SubmissionService.useSubmissionUpdate();
  const isSubmitting = isGrading || isUpdating;

  const handleSubmit = (values: GradeFormValues) => {
    if (!submission) return;
    const mutate = isGraded(submission.status) ? updateSubmission : gradeSubmission;
    mutate(
      { id: submission.id, params: values },
      {
        onSuccess: () => {
          notification.success({ message: "Lưu điểm thành công" });
          onGraded();
        },
        onError: (error: any) => {
          notification.error({
            message: error?.data?.msg ?? error?.message ?? "Không thể lưu điểm",
          });
        },
      },
    );
  };

  if (!hasSelection) {
    return (
      <Card>
        <EmptyState description="Chọn một học viên để chấm bài" className="py-16" />
      </Card>
    );
  }

  if (!submission || submission.status === "assigned") {
    return (
      <Card>
        <EmptyState description="Học viên chưa nộp bài" className="py-16" />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">Chấm điểm</p>
        <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
          <FormTeraItem
            label={`Điểm (0 – ${maxScore})`}
            name="score"
            rules={[
              {
                required: "Vui lòng nhập điểm",
                min: { value: 0, message: "Điểm phải từ 0 đến " + maxScore },
                max: { value: maxScore, message: "Điểm phải từ 0 đến " + maxScore },
              },
            ]}
          >
            <InputNumber min={0} max={maxScore} step={0.5} />
          </FormTeraItem>

          <FormTeraItem label="Nhận xét" name="comment">
            <TextArea placeholder="Nhận xét của giáo viên..." rows={5} />
          </FormTeraItem>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => form.handleSubmit(handleSubmit)()}
            className="mt-1 w-full rounded-lg bg-brand py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            Lưu điểm
          </button>
        </FormTera>
      </Card>

      <AISummaryPanel answer={submission.answer} />
    </div>
  );
};

export default GradingForm;
