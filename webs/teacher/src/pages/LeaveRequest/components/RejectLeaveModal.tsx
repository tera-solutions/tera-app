import { useEffect } from "react";
import { useForm } from "react-hook-form";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import FormScaff from "@tera/components/dof/FormScaff";
import TextArea from "@tera/components/dof/Control/TextArea";

interface RejectLeaveFormValues {
  rejection_reason: string;
}

interface RejectLeaveModalProps {
  open: boolean;
  isPending: boolean;
  onSubmit: (values: RejectLeaveFormValues) => void;
  onClose: () => void;
}

const RejectLeaveModal = ({ open, isPending, onSubmit, onClose }: RejectLeaveModalProps) => {
  const form = useForm<RejectLeaveFormValues>({ mode: "onChange", defaultValues: { rejection_reason: "" } });

  useEffect(() => {
    if (open) form.reset({ rejection_reason: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={false}
      titleCreate="Từ chối đơn xin nghỉ"
      titleEdit="Từ chối đơn xin nghỉ"
      className="!w-[95%] xmd:!w-[420px]"
      okText="Từ chối"
      onOk={() => form.handleSubmit(onSubmit)()}
      confirmLoading={isPending}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <FormTeraItem
          label="Lý do từ chối"
          name="rejection_reason"
          rules={[{ required: "Vui lòng nhập lý do từ chối" }]}
        >
          <TextArea placeholder="Nhập lý do..." rows={3} />
        </FormTeraItem>
      </FormTera>
    </FormScaff>
  );
};

export default RejectLeaveModal;
