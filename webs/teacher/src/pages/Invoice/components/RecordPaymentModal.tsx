import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Select } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import FormScaff from "@tera/components/dof/FormScaff";
import Input from "@tera/components/dof/Control/Input";
import InputNumber from "@tera/components/dof/Control/InputNumber";
import TextArea from "@tera/components/dof/Control/TextArea";

import { useMeta } from "_common/hooks/useMeta";

export interface RecordPaymentFormValues {
  amount: number;
  method: string;
  transaction_id?: string;
  note?: string;
}

interface RecordPaymentModalProps {
  open: boolean;
  maxAmount: number;
  isPending: boolean;
  onSubmit: (values: RecordPaymentFormValues) => void;
  onClose: () => void;
}

const RecordPaymentModal = ({ open, maxAmount, isPending, onSubmit, onClose }: RecordPaymentModalProps) => {
  const { getOptions } = useMeta();
  const form = useForm<RecordPaymentFormValues>({
    mode: "onChange",
    defaultValues: { amount: maxAmount, method: "cash", transaction_id: "", note: "" },
  });

  useEffect(() => {
    if (open) form.reset({ amount: maxAmount, method: "cash", transaction_id: "", note: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, maxAmount]);

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={false}
      titleCreate="Ghi nhận thanh toán"
      titleEdit="Ghi nhận thanh toán"
      className="!w-[95%] xmd:!w-[440px]"
      okText="Ghi nhận"
      onOk={() => form.handleSubmit(onSubmit)()}
      confirmLoading={isPending}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <FormTeraItem
          label={`Số tiền (còn lại tối đa ${maxAmount.toLocaleString("vi-VN")}đ)`}
          name="amount"
          rules={[
            { required: "Vui lòng nhập số tiền" },
            {
              validate: (v: number) =>
                (v > 0 && v <= maxAmount) || `Số tiền phải > 0 và không vượt quá ${maxAmount.toLocaleString("vi-VN")}đ`,
            },
          ]}
        >
          <InputNumber min={0} max={maxAmount} className="w-full" />
        </FormTeraItem>
        <FormTeraItem label="Phương thức" name="method" rules={[{ required: "Vui lòng chọn phương thức" }]}>
          <Controller
            control={form.control}
            name="method"
            render={({ field }) => (
              <Select value={field.value} onChange={field.onChange} options={getOptions("payment_method")} />
            )}
          />
        </FormTeraItem>
        <FormTeraItem label="Mã giao dịch" name="transaction_id">
          <Input placeholder="Mã tham chiếu (tùy chọn)" />
        </FormTeraItem>
        <FormTeraItem label="Ghi chú" name="note">
          <TextArea placeholder="Ghi chú thêm (tùy chọn)..." rows={2} />
        </FormTeraItem>
      </FormTera>
    </FormScaff>
  );
};

export default RecordPaymentModal;
