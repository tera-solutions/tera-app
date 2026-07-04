/* Import: library */
import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Modal, notification } from "tera-dls";

/* Import: packages */
import useIsMobile from "@tera/commons/hooks/useIsMobile";

/* Import: services */
import { EvaluationService } from "@tera/modules";

/* Import: pages */
import { IEvaluation } from "./_interface";

interface IForm {
  criteria: { criterion: string; score: number | string }[];
  comment: string;
  strengths: string;
  weaknesses: string;
  recommendations: string;
  evaluated_at: string;
}

// "knowledge" → "Knowledge", "teaching_method" → "Teaching method"
const humanize = (s: string) =>
  s ? s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()) : s;

interface IProps {
  open: boolean;
  record?: IEvaluation;
  onClose: () => void;
}

/** Modal sửa đánh giá — cập nhật tiêu chí + nhận xét + ngày đánh giá. */
const EvaluationFormModal = ({ open, record, onClose }: IProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { mutate: update, isPending } = EvaluationService.useEvaluationUpdate();

  const { control, register, handleSubmit, reset } = useForm<IForm>({
    defaultValues: {
      criteria: [],
      comment: "",
      strengths: "",
      weaknesses: "",
      recommendations: "",
      evaluated_at: "",
    },
  });

  const { fields } = useFieldArray({ control, name: "criteria" });

  useEffect(() => {
    if (!open || !record) return;
    reset({
      criteria: (record.criteria ?? []).map((c) => ({
        criterion: c.criterion,
        score: c.score,
      })),
      comment: record.comment ?? "",
      strengths: record.strengths ?? "",
      weaknesses: record.weaknesses ?? "",
      recommendations: record.recommendations ?? "",
      evaluated_at: record.evaluated_at
        ? String(record.evaluated_at).slice(0, 10)
        : "",
    });
  }, [open, record]);

  const onSubmit = (values: IForm) => {
    if (!record?.id) return;
    const params = {
      criteria: values.criteria.map((c) => ({
        criterion: c.criterion,
        score: Number(c.score),
      })),
      comment: values.comment || undefined,
      strengths: values.strengths || undefined,
      weaknesses: values.weaknesses || undefined,
      recommendations: values.recommendations || undefined,
      evaluated_at: values.evaluated_at || undefined,
    };
    update({ id: record.id, params }, {
      onSuccess: () => {
        notification.success({ message: t("common.update_success") });
        onClose();
      },
      onError: (e: any) =>
        notification.error({
          message: e?.message || t("common.error_message"),
        }),
    } as any);
  };

  const taClass =
    "w-full border border-gray-300 rounded px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500";

  return (
    <Modal
      title={t("evaluation.edit")}
      open={open}
      onCancel={onClose}
      onOk={() => handleSubmit(onSubmit)()}
      okText={t("button.save")}
      cancelText={t("button.cancel")}
      confirmLoading={isPending}
      destroyOnClose
      width={isMobile ? "94%" : 640}
      className='max-w-[640px]!'
    >
      <div className='flex flex-col gap-3'>
        {/* Tiêu chí */}
        {fields.length > 0 && (
          <div>
            <div className='mb-1.5 text-[13px] font-medium text-gray-700'>
              {t("evaluation.criteria")}
            </div>
            <div className='flex flex-col gap-2'>
              {fields.map((f, i) => (
                <div key={f.id} className='flex items-center gap-2'>
                  <span className='flex-1 text-[13px] text-gray-600'>
                    {t(`evaluation.crit_${f.criterion}`, humanize(f.criterion))}
                  </span>
                  <Controller
                    control={control}
                    name={`criteria.${i}.score`}
                    render={({ field }) => (
                      <input
                        {...field}
                        type='number'
                        min={0}
                        max={5}
                        step={0.5}
                        className='w-14 border border-gray-300 rounded px-1.5 py-1 text-[13px] text-center bg-white focus:outline-none focus:ring focus:ring-blue-300'
                      />
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ngày đánh giá */}
        <div>
          <label className='mb-1 block text-[13px] font-medium text-gray-700'>
            {t("evaluation.evaluated_at")}
          </label>
          <input
            type='date'
            {...register("evaluated_at")}
            className='h-9 border border-gray-300 rounded px-3 text-[13px] bg-white focus:outline-none focus:ring focus:ring-blue-300'
          />
        </div>

        {/* Nhận xét */}
        <div>
          <label className='mb-1 block text-[13px] font-medium text-gray-700'>
            {t("evaluation.comment")}
          </label>
          <textarea rows={2} {...register("comment")} className={taClass} />
        </div>
        <div>
          <label className='mb-1 block text-[13px] font-medium text-gray-700'>
            {t("evaluation.strengths")}
          </label>
          <textarea rows={2} {...register("strengths")} className={taClass} />
        </div>
        <div>
          <label className='mb-1 block text-[13px] font-medium text-gray-700'>
            {t("evaluation.weaknesses")}
          </label>
          <textarea rows={2} {...register("weaknesses")} className={taClass} />
        </div>
        <div>
          <label className='mb-1 block text-[13px] font-medium text-gray-700'>
            {t("evaluation.recommendations")}
          </label>
          <textarea
            rows={2}
            {...register("recommendations")}
            className={taClass}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EvaluationFormModal;
