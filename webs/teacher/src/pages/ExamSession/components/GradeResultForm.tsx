import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { notification } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import FormScaff from "@tera/components/dof/FormScaff";
import InputNumber from "@tera/components/dof/Control/InputNumber";

import type { ExamGradeFormValues, ExamResultRow } from "../_interface";
import { EXAM_SKILLS } from "../_interface";
import { SKILL_LABEL } from "../constants";
import { ExamResultService } from "@tera/modules/education";

interface GradeResultFormProps {
  open: boolean;
  onClose: () => void;
  row: ExamResultRow | null;
  onGraded: () => void;
}

const GradeResultForm = ({ open, onClose, row, onGraded }: GradeResultFormProps) => {
  const form = useForm<ExamGradeFormValues>({ mode: "onChange" });

  useEffect(() => {
    if (!open || !row) return;
    const values: ExamGradeFormValues = {};
    EXAM_SKILLS.forEach((skill) => {
      values[`${skill}_score`] = row.scores[skill];
    });
    form.reset(values);
  }, [open, row, form]);

  const { mutate: gradeResult, isPending } = ExamResultService.useExamResultGrade();

  const handleSubmit = (values: ExamGradeFormValues) => {
    if (!row) return;
    gradeResult(
      { id: row.registration_id, params: values },
      {
        onSuccess: () => {
          notification.success({ message: "Chấm thi thành công" });
          onGraded();
          onClose();
        },
        onError: (error: any) => {
          notification.error({
            message: error?.data?.msg ?? error?.message ?? "Không thể chấm thi",
          });
        },
      },
    );
  };

  const title = `Chấm điểm${row ? ` — ${row.student_name}` : ""}`;

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={false}
      titleCreate={title}
      titleEdit={title}
      className="!w-[95%] xmd:!w-[480px]"
      okText="Lưu điểm"
      onOk={() => form.handleSubmit(handleSubmit)()}
      confirmLoading={isPending}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-2 gap-x-4">
          {EXAM_SKILLS.map((skill) => (
            <FormTeraItem key={skill} label={SKILL_LABEL[skill]} name={`${skill}_score`}>
              <InputNumber min={0} step={0.5} placeholder="—" />
            </FormTeraItem>
          ))}
        </div>
      </FormTera>
    </FormScaff>
  );
};

export default GradeResultForm;
