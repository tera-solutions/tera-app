import { useMemo, useState } from "react";
import { notification, Select } from "tera-dls";

import FormScaff from "@tera/components/dof/FormScaff";
import FieldLabel from "_common/components/FieldLabel";
import { ExamSessionService, StudentService } from "@tera/modules/education";

interface Props {
  open: boolean;
  sessionId: number | null;
  registeredStudentIds: number[];
  onClose: () => void;
  onRegistered?: () => void;
}

const RegisterStudentsModal = ({ open, sessionId, registeredStudentIds, onClose, onRegistered }: Props) => {
  const [studentIds, setStudentIds] = useState<number[]>([]);

  const studentsQuery = StudentService.useStudentList({ params: { per_page: 200 } }, { enabled: open });
  const candidates = useMemo(
    () =>
      (studentsQuery.data?.data?.items ?? []).filter(
        (s: any) => !registeredStudentIds.includes(s.id),
      ),
    [studentsQuery.data, registeredStudentIds],
  );

  const { mutate: registerByStudent, isPending } = ExamSessionService.useExamSessionRegisterByStudent();

  const handleSubmit = () => {
    if (!sessionId || studentIds.length === 0) {
      notification.warning({ message: "Chọn ít nhất một học viên để đăng ký" });
      return;
    }
    registerByStudent(
      { id: sessionId, params: { student_ids: studentIds } },
      {
        onSuccess: () => {
          notification.success({ message: "Đã đăng ký học viên dự thi" });
          setStudentIds([]);
          onRegistered?.();
          onClose();
        },
        onError: (e: any) =>
          notification.error({ message: e?.data?.msg?.message ?? e?.data?.msg ?? "Không thể đăng ký học viên" }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={false}
      titleCreate="Đăng ký học viên dự thi"
      titleEdit="Đăng ký học viên dự thi"
      className="!w-[95%] xmd:!w-[480px]"
      confirmLoading={isPending}
      onOk={handleSubmit}
    >
      <div>
        <FieldLabel required>Học viên</FieldLabel>
        <Select
          mode="multiple"
          value={studentIds}
          placeholder="— Chọn học viên —"
          loading={studentsQuery.isLoading}
          options={candidates.map((s: any) => ({ value: s.id, label: s.name ?? s.full_name }))}
          onChange={(v: any) => setStudentIds((v ?? []).map(Number))}
        />
      </div>
    </FormScaff>
  );
};

export default RegisterStudentsModal;
