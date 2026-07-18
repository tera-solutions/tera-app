import { useEffect, useState } from "react";
import { notification } from "tera-dls";

import FormScaff from "@tera/components/dof/FormScaff";
import LessonSelect from "_common/components/LessonSelect";

import type { LeaveRequestRow } from "../_interface";

interface ScheduleMakeupModalProps {
  open: boolean;
  request: LeaveRequestRow | null;
  isPending: boolean;
  onSubmit: (makeupLessonId: number | string) => void;
  onClose: () => void;
}

/** Xếp buổi học bù cho một entitlement đang "Chờ xếp lịch" (`v1/edu/leave/makeup/schedule/{id}`). */
const ScheduleMakeupModal = ({ open, request, isPending, onSubmit, onClose }: ScheduleMakeupModalProps) => {
  const [makeupLessonId, setMakeupLessonId] = useState<number | string | undefined>(undefined);

  useEffect(() => {
    if (open) setMakeupLessonId(undefined);
  }, [open]);

  const handleOk = () => {
    if (!makeupLessonId) {
      notification.warning({ message: "Vui lòng chọn buổi học bù" });
      return;
    }
    onSubmit(makeupLessonId);
  };

  const title = `Xếp lịch học bù${request ? ` — ${request.requesterName ?? ""}` : ""}`;

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={false}
      titleCreate={title}
      titleEdit={title}
      className="!w-[95%] xmd:!w-[420px]"
      okText="Xếp lịch"
      onOk={handleOk}
      confirmLoading={isPending}
    >
      <label className="mb-1.5 block text-sm font-medium text-slate-600">Buổi học bù</label>
      <LessonSelect
        value={makeupLessonId}
        onChange={setMakeupLessonId}
        classRoomId={request?.classRoomId}
        className="h-11 w-full"
      />
    </FormScaff>
  );
};

export default ScheduleMakeupModal;
