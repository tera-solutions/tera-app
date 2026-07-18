import { useEffect } from "react";
import { useForm } from "react-hook-form";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import FormScaff from "@tera/components/dof/FormScaff";
import TextArea from "@tera/components/dof/Control/TextArea";

interface ReasonFormValues {
  reason: string;
  note?: string;
}

interface InvoiceReasonModalProps {
  open: boolean;
  title: string;
  okText: string;
  isPending: boolean;
  onSubmit: (values: ReasonFormValues) => void;
  onClose: () => void;
}

/** Modal dùng chung cho deny/cancel/refund — cả 3 action đều yêu cầu `reason` (invoice.md §IX). */
const InvoiceReasonModal = ({ open, title, okText, isPending, onSubmit, onClose }: InvoiceReasonModalProps) => {
  const form = useForm<ReasonFormValues>({ mode: "onChange", defaultValues: { reason: "", note: "" } });

  useEffect(() => {
    if (open) form.reset({ reason: "", note: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={false}
      titleCreate={title}
      titleEdit={title}
      className="!w-[95%] xmd:!w-[440px]"
      okText={okText}
      onOk={() => form.handleSubmit(onSubmit)()}
      confirmLoading={isPending}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <FormTeraItem label="Lý do" name="reason" rules={[{ required: "Vui lòng nhập lý do" }]}>
          <TextArea placeholder="Nhập lý do..." rows={3} />
        </FormTeraItem>
        <FormTeraItem label="Ghi chú" name="note">
          <TextArea placeholder="Ghi chú thêm (tùy chọn)..." rows={2} />
        </FormTeraItem>
      </FormTera>
    </FormScaff>
  );
};

export default InvoiceReasonModal;
