import { useEffect, useState } from "react";
import { notification, TextArea } from "tera-dls";

import FormScaff from "@tera/components/dof/FormScaff";
import FieldLabel from "_common/components/FieldLabel";
import LevelSelect from "_common/components/LevelSelect";
import { StudentLevelService } from "@tera/modules/education";

interface UpdateLevelModalProps {
  open: boolean;
  onClose: () => void;
  /** The student_level record id (`GetStudentLevelAction` response), not the student id. */
  studentLevelId: number | null;
  currentLevelId: number | null;
}

/** Promotes/moves a student to a new level (`edu/student-level/promote/{id}`) —
 * accepts any target level and an optional reason, matching the spec's
 * "Cập nhật trình độ" modal. */
const UpdateLevelModal = ({ open, onClose, studentLevelId, currentLevelId }: UpdateLevelModalProps) => {
  const [levelId, setLevelId] = useState<number | "">("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) return;
    setLevelId("");
    setReason("");
  }, [open]);

  const { mutate: promote, isPending } = StudentLevelService.useStudentLevelPromote();

  const handleSubmit = () => {
    if (!studentLevelId) return;
    if (!levelId) {
      notification.warning({ message: "Vui lòng chọn trình độ mới" });
      return;
    }
    if (Number(levelId) === currentLevelId) {
      notification.warning({ message: "Vui lòng chọn trình độ mới khác trình độ hiện tại" });
      return;
    }

    promote(
      { id: studentLevelId, params: { target_level_id: Number(levelId), reason: reason.trim() || undefined } },
      {
        onSuccess: () => {
          notification.success({ message: "Đã cập nhật trình độ" });
          onClose();
        },
        onError: (error: any) =>
          notification.error({ message: error?.data?.msg ?? "Không thể cập nhật trình độ" }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit
      titleCreate="Cập nhật trình độ"
      titleEdit="Cập nhật trình độ"
      className="!w-[95%] xmd:!w-[440px]"
      okText="Lưu"
      onOk={handleSubmit}
      confirmLoading={isPending}
    >
      <div className="space-y-3">
        <div>
          <FieldLabel required>Trình độ mới</FieldLabel>
          <LevelSelect value={levelId} onChange={(v) => setLevelId(v != null ? Number(v) : "")} />
        </div>
        <div>
          <FieldLabel>Căn cứ / Ghi chú</FieldLabel>
          <TextArea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
      </div>
    </FormScaff>
  );
};

export default UpdateLevelModal;
