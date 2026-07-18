import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { notification, Select } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import FormScaff from "@tera/components/dof/FormScaff";
import InputNumber from "@tera/components/dof/Control/InputNumber";
import TextArea from "@tera/components/dof/Control/TextArea";
import { EvaluationService, StudentService } from "@tera/modules/education";
import { toClassStudentResult } from "pages/ClassroomDetail/_utils";

/** The 4 skill criteria added to `EvaluationType::criteria()` for `student` type. */
const SKILL_KEYS = ["listening", "speaking", "reading", "writing"] as const;
type SkillKey = (typeof SKILL_KEYS)[number];

const SKILL_LABEL: Record<SkillKey, string> = {
  listening: "Nghe",
  speaking: "Nói",
  reading: "Đọc",
  writing: "Viết",
};

const DEFAULT_SCORE = 3;

interface SkillEvaluationFormValues {
  student_id: number | undefined;
  skills: Record<SkillKey, number>;
  comment: string;
}

const defaultSkills = SKILL_KEYS.reduce(
  (acc, key) => ({ ...acc, [key]: DEFAULT_SCORE }),
  {} as Record<SkillKey, number>,
);

interface SkillEvaluationFormProps {
  open: boolean;
  onClose: () => void;
  classId: number | null;
  lessonId: number;
}

const SkillEvaluationForm = ({ open, onClose, classId, lessonId }: SkillEvaluationFormProps) => {
  const form = useForm<SkillEvaluationFormValues>({
    mode: "onChange",
    defaultValues: { student_id: undefined, skills: defaultSkills, comment: "" },
  });

  const rosterQuery = StudentService.useStudentList(
    { params: { class_id: classId ?? 0, per_page: 200 } },
    { enabled: !!classId && open },
  );
  const roster = useMemo(
    () => toClassStudentResult(rosterQuery.data?.data).items,
    [rosterQuery.data],
  );
  const studentOptions = roster.map((s) => ({ value: s.id, label: s.name }));

  const { mutate: createEvaluation, isPending } = EvaluationService.useEvaluationCreate();

  const handleClose = () => {
    form.reset({ student_id: undefined, skills: defaultSkills, comment: "" });
    onClose();
  };

  const handleSubmit = (values: SkillEvaluationFormValues) => {
    if (!values.student_id || !classId) return;

    createEvaluation(
      {
        params: {
          evaluation_type: "student",
          target_id: values.student_id,
          evaluator_type: "teacher",
          class_room_id: classId,
          lesson_id: lessonId,
          evaluation_period: "lesson",
          criteria: SKILL_KEYS.map((key) => ({ criterion: key, score: values.skills[key] })),
          comment: values.comment,
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Lưu đánh giá kỹ năng thành công" });
          handleClose();
        },
        onError: (error: any) => {
          const message =
            error?.data?.msg ?? error?.data?.message ?? error?.message ?? "Không thể lưu đánh giá";
          notification.error({ message });
        },
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={handleClose}
      isEdit={false}
      titleCreate="Đánh giá kỹ năng theo bài học"
      titleEdit="Đánh giá kỹ năng theo bài học"
      className="!w-[95%] xmd:!w-[520px]"
      okText="Lưu đánh giá"
      onOk={() => form.handleSubmit(handleSubmit)()}
      confirmLoading={isPending}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTeraItem
          label="Học viên"
          name="student_id"
          rules={[{ required: "Vui lòng chọn học viên" }]}
        >
          <Controller
            control={form.control}
            name="student_id"
            render={({ field }) => (
              <Select
                value={field.value}
                options={studentOptions}
                onChange={field.onChange}
                loading={rosterQuery.isLoading}
                placeholder="Chọn học viên"
              />
            )}
          />
        </FormTeraItem>

        <p className="mb-2 text-sm font-semibold text-slate-700">Điểm kỹ năng (1-5)</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {SKILL_KEYS.map((key) => (
            <FormTeraItem
              key={key}
              label={SKILL_LABEL[key]}
              name={`skills.${key}`}
              rules={[
                {
                  required: "Bắt buộc",
                  min: { value: 1, message: "Tối thiểu 1" },
                  max: { value: 5, message: "Tối đa 5" },
                },
              ]}
            >
              <InputNumber min={1} max={5} />
            </FormTeraItem>
          ))}
        </div>

        <FormTeraItem label="Nhận xét" name="comment">
          <TextArea placeholder="Nhận xét thêm về kỹ năng của học viên..." rows={3} />
        </FormTeraItem>
      </FormTera>
    </FormScaff>
  );
};

export default SkillEvaluationForm;
