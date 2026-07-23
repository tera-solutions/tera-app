import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { DatePicker, Input, notification, Select } from "tera-dls";

import FormScaff from "@tera/components/dof/FormScaff";
import BranchSelect from "_common/components/BranchSelect";
import FieldLabel from "_common/components/FieldLabel";
import LevelSelect from "_common/components/LevelSelect";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { LeadService } from "@tera/modules/crm";

import type { LeadDetail } from "../_interface";

const GENDER_OPTIONS = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];
const DATE_FORMAT = "YYYY-MM-DD";

interface ConvertToStudentModalProps {
  open: boolean;
  lead: LeadDetail | null;
  onClose: () => void;
}

/** Confirms/completes the student fields the lead itself doesn't already
 * have (dob/gender/branch) before calling the backend convert action, which
 * creates the student, links it back to the lead, and moves the lead to
 * "studying" in one transaction. */
const ConvertToStudentModal = ({ open, lead, onClose }: ConvertToStudentModalProps) => {
  const navigate = useNavigate();
  const { mutate: convertLead, isPending } = LeadService.useLeadConvert();

  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("male");
  const [branchId, setBranchId] = useState<number | "">("");
  const [levelId, setLevelId] = useState<number | "">("");
  const [enrollmentDate, setEnrollmentDate] = useState(moment().format(DATE_FORMAT));

  useEffect(() => {
    if (!open || !lead) return;
    setDob(lead.dob || "");
    setGender(lead.gender || "male");
    setBranchId(lead.branch_id || "");
    setLevelId("");
    setEnrollmentDate(moment().format(DATE_FORMAT));
  }, [open, lead]);

  const handleSubmit = () => {
    if (!lead) return;
    if (!dob) {
      notification.warning({ message: "Vui lòng nhập ngày sinh" });
      return;
    }
    if (!branchId) {
      notification.warning({ message: "Vui lòng chọn chi nhánh" });
      return;
    }

    convertLead(
      {
        id: lead.id,
        params: {
          dob,
          gender,
          branch_id: Number(branchId),
          level_id: levelId === "" ? undefined : Number(levelId),
          enrollment_date: enrollmentDate,
        },
      },
      {
        onSuccess: (res: any) => {
          notification.success({ message: "Đã chuyển đổi thành học viên" });
          onClose();
          const studentId = res?.data?.student_id;
          if (studentId) navigate(`${PATHS.studentDetail}/${studentId}`);
        },
        onError: (error: any) =>
          notification.error({
            message: error?.data?.msg ?? error?.message ?? "Không thể chuyển đổi thành học viên",
          }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit
      titleCreate="Chuyển đổi thành học viên"
      titleEdit="Chuyển đổi thành học viên"
      className="!w-[95%] xmd:!w-[460px]"
      okText="Xác nhận chuyển đổi"
      onOk={handleSubmit}
      confirmLoading={isPending}
    >
      <div className="space-y-3">
        <div>
          <FieldLabel>Họ tên</FieldLabel>
          <Input value={lead?.name ?? ""} disabled />
        </div>
        <div>
          <FieldLabel>Số điện thoại</FieldLabel>
          <Input value={lead?.phone ?? ""} disabled />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel required>Giới tính</FieldLabel>
            <Select value={gender} options={GENDER_OPTIONS} onChange={(v) => setGender(v as string)} />
          </div>
          <div>
            <FieldLabel required>Ngày sinh</FieldLabel>
            <DatePicker
              className="w-full"
              format={DATE_FORMAT}
              value={dob ? moment(dob, DATE_FORMAT) : undefined}
              onChange={(v: any) => setDob(v ? moment(v).format(DATE_FORMAT) : "")}
            />
          </div>
        </div>
        <div>
          <FieldLabel required>Chi nhánh</FieldLabel>
          <BranchSelect value={branchId} onChange={(v) => setBranchId(v != null ? Number(v) : "")} />
        </div>
        <div>
          <FieldLabel>Trình độ ban đầu</FieldLabel>
          <LevelSelect
            value={levelId || undefined}
            allowClear
            onChange={(v) => setLevelId(v != null ? Number(v) : "")}
          />
        </div>
        <div>
          <FieldLabel required>Ngày ghi danh</FieldLabel>
          <DatePicker
            className="w-full"
            format={DATE_FORMAT}
            value={enrollmentDate ? moment(enrollmentDate, DATE_FORMAT) : undefined}
            onChange={(v: any) => setEnrollmentDate(v ? moment(v).format(DATE_FORMAT) : "")}
          />
        </div>
      </div>
    </FormScaff>
  );
};

export default ConvertToStudentModal;
