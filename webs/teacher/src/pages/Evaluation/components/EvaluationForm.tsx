import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { notification, Select } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import FormScaff from "@tera/components/dof/FormScaff";
import InputNumber from "@tera/components/dof/Control/InputNumber";
import TextArea from "@tera/components/dof/Control/TextArea";

import { EvaluationCriteriaTemplateService, EvaluationService } from "@tera/modules/education";

import type { EvaluationCriterion, EvaluationFormValues } from "../_interface";
import { CRITERION_KEYS, CRITERION_LABEL, DEFAULT_CRITERIA_SCORE, EVALUATION_PERIOD_OPTIONS } from "../constants";

const DEFAULT_TEMPLATE_VALUE = "__default__";

const buildDefaultCriteria = (keys: string[]) =>
  keys.reduce((acc, key) => ({ ...acc, [key]: DEFAULT_CRITERIA_SCORE }), {} as Record<string, number>);

const defaultCriteria = buildDefaultCriteria(CRITERION_KEYS);

interface EvaluationFormProps {
  open: boolean;
  onClose: () => void;
  studentId: number | null;
  studentName?: string;
  classId: number | null;
}

const EvaluationForm = ({ open, onClose, studentId, studentName, classId }: EvaluationFormProps) => {
  const [templateId, setTemplateId] = useState<string>(DEFAULT_TEMPLATE_VALUE);

  const form = useForm<EvaluationFormValues>({
    mode: "onChange",
    defaultValues: { criteria: defaultCriteria, comment: "", evaluation_period: "session" },
  });

  const { mutate: createEvaluation, isPending } = EvaluationService.useEvaluationCreate();

  const templatesQuery = EvaluationCriteriaTemplateService.useEvaluationCriteriaTemplateList(
    { params: { per_page: 50, filters: { evaluation_type: "student", status: "active" } } },
    { enabled: open },
  );
  const templates = templatesQuery.data?.data?.items ?? [];

  const templateOptions = useMemo(
    () => [
      { value: DEFAULT_TEMPLATE_VALUE, label: "Tiêu chí mặc định" },
      ...templates.map((t: any) => ({ value: String(t.id), label: t.name })),
    ],
    [templates],
  );

  // Criteria fields track the picked template's keys (a validated subset of
  // CRITERION_KEYS — EvaluationCriteriaTemplate can only contain keys
  // EvaluationType::criteria() allows), falling back to the full default set.
  const activeCriteria = useMemo<EvaluationCriterion[]>(() => {
    if (templateId === DEFAULT_TEMPLATE_VALUE) return CRITERION_KEYS;
    const template = templates.find((t: any) => String(t.id) === templateId);
    return (template?.criteria ?? CRITERION_KEYS) as EvaluationCriterion[];
  }, [templateId, templates]);

  useEffect(() => {
    form.setValue("criteria", buildDefaultCriteria(activeCriteria));
  }, [activeCriteria]);

  const handleClose = () => {
    setTemplateId(DEFAULT_TEMPLATE_VALUE);
    form.reset({ criteria: defaultCriteria, comment: "", evaluation_period: "session" });
    onClose();
  };

  const handleSubmit = (values: EvaluationFormValues) => {
    if (!studentId || !classId) return;

    createEvaluation(
      {
        params: {
          evaluation_type: "student",
          target_id: studentId,
          evaluator_type: "teacher",
          class_room_id: classId,
          evaluation_period: values.evaluation_period,
          criteria: activeCriteria.map((key) => ({ criterion: key, score: values.criteria[key] })),
          comment: values.comment,
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Thêm nhận xét thành công" });
          handleClose();
        },
        onError: (error: any) => {
          const message =
            error?.data?.msg ?? error?.data?.message ?? error?.message ?? "Không thể lưu nhận xét";
          notification.error({ message });
        },
      },
    );
  };

  const title = `Thêm nhận xét${studentName ? ` — ${studentName}` : ""}`;

  return (
    <FormScaff
      open={open}
      onClose={handleClose}
      isEdit={false}
      titleCreate={title}
      titleEdit={title}
      className="!w-[95%] xmd:!w-[560px]"
      okText="Lưu nhận xét"
      onOk={() => form.handleSubmit(handleSubmit)()}
      confirmLoading={isPending}
    >
      <div className="mb-3">
        <p className="mb-1 text-xs font-medium text-slate-500">Bảng tiêu chí</p>
        <Select
          value={templateId}
          options={templateOptions}
          loading={templatesQuery.isLoading}
          onChange={(v: any) => setTemplateId(v)}
        />
      </div>

      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <p className="mb-2 text-sm font-semibold text-slate-700">Tiêu chí đánh giá (1-5)</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
          {activeCriteria.map((key) => (
            <FormTeraItem
              key={key}
              label={CRITERION_LABEL[key]}
              name={`criteria.${key}`}
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

        <FormTeraItem label="Kỳ đánh giá" name="evaluation_period">
          <Controller
            control={form.control}
            name="evaluation_period"
            render={({ field }) => (
              <Select
                value={field.value}
                options={EVALUATION_PERIOD_OPTIONS}
                onChange={field.onChange}
              />
            )}
          />
        </FormTeraItem>

        <FormTeraItem
          label="Nội dung nhận xét"
          name="comment"
          rules={[
            {
              required: "Vui lòng nhập nội dung nhận xét",
              minLength: { value: 10, message: "Nội dung nhận xét cần ít nhất 10 ký tự" },
            },
          ]}
        >
          <TextArea placeholder="Nhận xét về học viên..." rows={4} />
        </FormTeraItem>
      </FormTera>
    </FormScaff>
  );
};

export default EvaluationForm;
