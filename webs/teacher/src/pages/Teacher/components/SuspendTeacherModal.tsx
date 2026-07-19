import { useEffect, useState } from "react";
import { notification, TextArea } from "tera-dls";

import FormScaff from "@tera/components/dof/FormScaff";
import FieldLabel from "_common/components/FieldLabel";

interface SuspendTeacherModalProps {
  open: boolean;
  isPending: boolean;
  onSubmit: (reason: string) => void;
  onClose: () => void;
}

/** `SuspendTeacherRequest` (BE) yêu cầu `reason` bắt buộc. */
const SuspendTeacherModal = ({ open, isPending, onSubmit, onClose }: SuspendTeacherModalProps) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  const handleSubmit = () => {
    if (!reason.trim()) {
      notification.warning({ message: "Vui lòng nhập lý do" });
      return;
    }
    onSubmit(reason.trim());
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={false}
      titleCreate="Tạm ngưng giáo viên"
      titleEdit="Tạm ngưng giáo viên"
      className="!w-[95%] xmd:!w-[440px]"
      okText="Tạm ngưng"
      confirmLoading={isPending}
      onOk={handleSubmit}
    >
      <div>
        <FieldLabel required>Lý do</FieldLabel>
        <TextArea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do tạm ngưng..."
          rows={3}
          className="w-full resize-none"
        />
      </div>
    </FormScaff>
  );
};

export default SuspendTeacherModal;
