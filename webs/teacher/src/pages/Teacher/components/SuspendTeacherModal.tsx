import { useEffect, useState } from "react";
import { notification } from "tera-dls";

import FormScaff from "@tera/components/dof/FormScaff";

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
        <label className="mb-1.5 block text-sm font-medium text-slate-600">
          Lý do <span className="text-rose-500">*</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do tạm ngưng..."
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none"
        />
      </div>
    </FormScaff>
  );
};

export default SuspendTeacherModal;
