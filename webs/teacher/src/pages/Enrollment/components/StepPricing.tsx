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

  const applyPreset = (preset: (typeof PRICING_PRESETS)[number]) => {
    form.setValue("total_lessons", preset.total_lessons, { shouldValidate: true });
    form.setValue("price_per_lesson", preset.price_per_lesson, { shouldValidate: true });
  };

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-700">Chọn nhanh gói học phí</p>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PRICING_PRESETS.map((preset) => {
          const isActive =
            watched.total_lessons === preset.total_lessons &&
            watched.price_per_lesson === preset.price_per_lesson;
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
              {preset.price_per_lesson > 0 && (
                <p className="mt-0.5 text-xs text-slate-400">{formatVnd(preset.price_per_lesson)}/buổi</p>
              )}
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
