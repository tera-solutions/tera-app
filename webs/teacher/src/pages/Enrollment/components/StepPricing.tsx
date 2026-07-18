import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Select } from "tera-dls";
import classNames from "classnames";

import Card from "_common/components/Card";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import InputNumber from "@tera/components/dof/Control/InputNumber";

import type { EnrollmentPricing } from "../_interface";
import { PAYMENT_METHOD_OPTIONS, PRICING_PRESETS } from "../constants";
import { calcTuitionAmount, formatVnd } from "../_utils";

interface StepPricingProps {
  values: EnrollmentPricing;
  onBack: () => void;
  onNext: (values: EnrollmentPricing) => void;
}

const StepPricing = ({ values, onBack, onNext }: StepPricingProps) => {
  const form = useForm<EnrollmentPricing>({ mode: "onChange", defaultValues: values });
  const watched = form.watch();
  const { dirtyFields } = form.formState;

  // `values.price_per_lesson` arrives async (seeded from the class's course
  // once its detail query resolves) — react-hook-form's `defaultValues` only
  // apply at mount, so sync it in once the real price lands. `setValue`
  // without `shouldDirty` doesn't mark the field dirty, so this only fires
  // while the user hasn't actually typed into the field themselves.
  useEffect(() => {
    if (!dirtyFields.price_per_lesson) form.setValue("price_per_lesson", values.price_per_lesson);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.price_per_lesson]);

  const applyPreset = (preset: (typeof PRICING_PRESETS)[number]) => {
    form.setValue("total_lessons", preset.total_lessons, { shouldValidate: true });
  };

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-700">Chọn nhanh số buổi học</p>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PRICING_PRESETS.map((preset) => {
          const isActive = watched.total_lessons === preset.total_lessons;
          return (
            <button
              key={preset.key}
              type="button"
              onClick={() => applyPreset(preset)}
              className={classNames(
                "rounded-xl border p-3 text-left transition-colors",
                isActive ? "border-brand bg-sky-50/60" : "border-slate-200 hover:border-brand/50",
              )}
            >
              <p className="text-sm font-semibold text-slate-800">{preset.label}</p>
            </button>
          );
        })}
      </div>

      <FormTera form={form} onSubmit={form.handleSubmit(onNext)}>
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <FormTeraItem
            label="Số buổi học"
            name="total_lessons"
            rules={[{ required: "Vui lòng nhập số buổi học" }]}
          >
            <InputNumber min={1} />
          </FormTeraItem>

          <FormTeraItem
            label="Đơn giá / buổi"
            name="price_per_lesson"
            rules={[{ required: "Vui lòng nhập đơn giá mỗi buổi" }]}
          >
            <InputNumber min={0} />
          </FormTeraItem>

          <FormTeraItem label="Giảm giá (%)" name="discount_percent">
            <InputNumber min={0} max={100} />
          </FormTeraItem>

          <FormTeraItem label="Buổi tặng thêm" name="bonus_lessons">
            <InputNumber min={0} />
          </FormTeraItem>

          <FormTeraItem label="Đã thanh toán" name="paid_amount">
            <InputNumber min={0} />
          </FormTeraItem>

          <FormTeraItem label="Phương thức thanh toán" name="payment_method">
            <Controller
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <Select value={field.value} options={PAYMENT_METHOD_OPTIONS} onChange={field.onChange} />
              )}
            />
          </FormTeraItem>
        </div>

        <p className="mt-2 text-sm text-slate-600">
          Học phí: <span className="font-semibold text-slate-800">{formatVnd(calcTuitionAmount(watched))}</span>
          {" "}/ học viên
        </p>

        <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
          <Button outlined onClick={onBack}>
            ← Quay lại
          </Button>
          <Button htmlType="submit">Tiếp theo →</Button>
        </div>
      </FormTera>
    </Card>
  );
};

export default StepPricing;
