import { useEffect, useState } from "react";
import moment from "moment";
import { DatePicker, Input, InputNumber, notification, Select, TextArea } from "tera-dls";

import { TeacherService } from "@tera/modules/hr";
import FormScaff from "@tera/components/dof/FormScaff";

import AvatarUpload from "_common/components/AvatarUpload";
import BranchSelect from "_common/components/BranchSelect";
import FieldLabel from "_common/components/FieldLabel";
import { useMeta } from "_common/hooks/useMeta";

import type { Teacher } from "../_interface";
import { EMPLOYMENT_TYPES, TEACHER_TYPE_META } from "../constants";

const DATE_FORMAT = "YYYY-MM-DD";
const GENDER_OPTIONS = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];

const SKILL_LEVELS = [
  { value: "beginner", label: "Mới bắt đầu" },
  { value: "intermediate", label: "Trung cấp" },
  { value: "advanced", label: "Nâng cao" },
  { value: "expert", label: "Chuyên gia" },
];

interface Props {
  open: boolean;
  teacher: Teacher | null;
  onClose: () => void;
}

const empty = {
  full_name: "",
  code: "",
  avatar: "",
  gender: "male",
  dob: "",
  email: "",
  phone: "",
  identity_no: "",
  address: "",
  branch_id: "" as number | "",
  joined_at: "",
  teacher_type: "full_time",
  employment_type: "contract",
  hourly_rate: "",
  monthly_salary: "",
  skill_name: "",
  skill_level: "intermediate",
  bank_name: "",
  bank_account_number: "",
  bank_account_holder: "",
  bank_branch: "",
  note: "",
};

/** Tạo/sửa hồ sơ giáo viên — `v1/hr/teacher/*`. Mã giáo viên/chi nhánh/ngày vào
 * làm/chuyên môn chỉ bắt buộc khi tạo mới (BE: CreateTeacherRequest). */
const TeacherFormModal = ({ open, teacher, onClose }: Props) => {
  const isEdit = !!teacher;
  const { getOptions } = useMeta();
  const { mutate: create, isPending: creating } = TeacherService.useTeacherCreate();
  const { mutate: update, isPending: updating } = TeacherService.useTeacherUpdate();

  const [form, setForm] = useState(empty);
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (!open) return;
    if (teacher) {
      setForm({
        ...empty,
        full_name: teacher.fullName,
        avatar: teacher.avatar,
        gender: teacher.gender ?? "male",
        dob: teacher.dob ?? "",
        email: teacher.email ?? "",
        phone: teacher.phone ?? "",
        identity_no: teacher.identityNo ?? "",
        address: teacher.address ?? "",
        branch_id: teacher.branchId ?? "",
        teacher_type: teacher.teacherType || "full_time",
        employment_type: teacher.employmentType ?? "contract",
        hourly_rate: teacher.hourlyRate != null ? String(teacher.hourlyRate) : "",
        monthly_salary: teacher.monthlySalary != null ? String(teacher.monthlySalary) : "",
        bank_name: teacher.bankAccount?.bankName ?? "",
        bank_account_number: teacher.bankAccount?.bankAccountNumber ?? "",
        bank_account_holder: teacher.bankAccount?.bankAccountHolder ?? "",
        bank_branch: teacher.bankAccount?.bankBranch ?? "",
        note: teacher.note ?? "",
      });
    } else {
      setForm(empty);
    }
  }, [open, teacher]);

  const bankAccount =
    form.bank_name.trim() || form.bank_account_number.trim() || form.bank_account_holder.trim()
      ? {
          bank_name: form.bank_name.trim() || undefined,
          bank_account_number: form.bank_account_number.trim() || undefined,
          bank_account_holder: form.bank_account_holder.trim() || undefined,
          bank_branch: form.bank_branch.trim() || undefined,
        }
      : undefined;

  const handleSubmit = () => {
    if (!form.full_name.trim()) {
      notification.warning({ message: "Vui lòng nhập họ tên" });
      return;
    }

    const done = {
      onSuccess: () => {
        notification.success({ message: isEdit ? "Đã cập nhật giáo viên" : "Đã tạo giáo viên" });
        onClose();
      },
      onError: (e: any) =>
        notification.error({ message: e?.data?.msg?.message ?? e?.data?.msg ?? "Không thể lưu giáo viên" }),
    };

    if (isEdit && teacher) {
      update(
        {
          id: teacher.id,
          params: {
            full_name: form.full_name.trim(),
            avatar: form.avatar || undefined,
            gender: form.gender || undefined,
            dob: form.dob || undefined,
            email: form.email.trim() || undefined,
            phone: form.phone.trim() || undefined,
            identity_no: form.identity_no.trim() || undefined,
            address: form.address.trim() || undefined,
            branch_id: form.branch_id ? Number(form.branch_id) : undefined,
            teacher_type: form.teacher_type,
            employment_type: form.employment_type || undefined,
            hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : undefined,
            monthly_salary: form.monthly_salary ? Number(form.monthly_salary) : undefined,
            bank_account: bankAccount,
            note: form.note.trim() || undefined,
          },
        },
        done,
      );
    } else {
      if (!form.code.trim() || !form.email.trim() || !form.phone.trim() || !form.branch_id || !form.joined_at) {
        notification.warning({ message: "Vui lòng nhập đầy đủ mã, email, SĐT, chi nhánh, ngày vào làm" });
        return;
      }
      if (!form.skill_name.trim()) {
        notification.warning({ message: "Vui lòng nhập ít nhất một chuyên môn" });
        return;
      }
      create(
        {
          params: {
            full_name: form.full_name.trim(),
            code: form.code.trim(),
            avatar: form.avatar || undefined,
            gender: form.gender || undefined,
            dob: form.dob || undefined,
            email: form.email.trim(),
            phone: form.phone.trim(),
            identity_no: form.identity_no.trim() || undefined,
            address: form.address.trim() || undefined,
            branch_id: Number(form.branch_id),
            joined_at: form.joined_at,
            teacher_type: form.teacher_type,
            employment_type: form.employment_type,
            hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : undefined,
            monthly_salary: form.monthly_salary ? Number(form.monthly_salary) : undefined,
            bank_account: bankAccount,
            note: form.note.trim() || undefined,
            skills: [{ skill_name: form.skill_name.trim(), level: form.skill_level }],
          },
        },
        done,
      );
    }
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={isEdit}
      titleCreate="Tạo giáo viên"
      titleEdit="Sửa hồ sơ giáo viên"
      className="!w-[95%] xmd:!w-[600px]"
      confirmLoading={creating || updating}
      onOk={handleSubmit}
    >
      <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
        <div className="flex justify-center">
          <AvatarUpload
            src={form.avatar}
            alt={form.full_name}
            onUploaded={(url) => set({ avatar: url })}
          />
        </div>

        <div>
          <FieldLabel required>Họ tên</FieldLabel>
          <Input value={form.full_name} onChange={(e) => set({ full_name: e.target.value })} />
        </div>

        {!isEdit && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>Mã giáo viên</FieldLabel>
              <Input value={form.code} onChange={(e) => set({ code: e.target.value })} />
            </div>
            <div>
              <FieldLabel required>Ngày vào làm</FieldLabel>
              <DatePicker
                className="w-full"
                format={DATE_FORMAT}
                value={form.joined_at ? moment(form.joined_at, DATE_FORMAT) : undefined}
                onChange={(v: any) => set({ joined_at: v ? moment(v).format(DATE_FORMAT) : "" })}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Giới tính</FieldLabel>
            <Select
              value={form.gender}
              options={GENDER_OPTIONS}
              onChange={(v) => set({ gender: v as string })}
            />
          </div>
          <div>
            <FieldLabel>Ngày sinh</FieldLabel>
            <DatePicker
              className="w-full"
              format={DATE_FORMAT}
              value={form.dob ? moment(form.dob, DATE_FORMAT) : undefined}
              onChange={(v: any) => set({ dob: v ? moment(v).format(DATE_FORMAT) : "" })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel required={!isEdit}>Email</FieldLabel>
            <Input value={form.email} onChange={(e) => set({ email: e.target.value })} />
          </div>
          <div>
            <FieldLabel required={!isEdit}>Số điện thoại</FieldLabel>
            <Input value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>CMND/CCCD</FieldLabel>
            <Input value={form.identity_no} onChange={(e) => set({ identity_no: e.target.value })} />
          </div>
          <div>
            <FieldLabel>Địa chỉ</FieldLabel>
            <Input value={form.address} onChange={(e) => set({ address: e.target.value })} />
          </div>
        </div>

        <div>
          <FieldLabel required={!isEdit}>Chi nhánh</FieldLabel>
          <BranchSelect
            value={form.branch_id}
            onChange={(v) => set({ branch_id: v != null ? Number(v) : "" })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
          <div>
            <FieldLabel>Hình thức làm việc</FieldLabel>
            <Select
              value={form.teacher_type}
              options={getOptions(TEACHER_TYPE_META)}
              onChange={(v) => set({ teacher_type: v as string })}
            />
          </div>
          <div>
            <FieldLabel>Loại hợp tác</FieldLabel>
            <Select
              value={form.employment_type}
              options={EMPLOYMENT_TYPES}
              onChange={(v) => set({ employment_type: v as string })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Lương theo giờ (đ)</FieldLabel>
            <InputNumber
              min={0}
              className="w-full"
              value={form.hourly_rate ? Number(form.hourly_rate) : undefined}
              onChange={(v) => set({ hourly_rate: v == null ? "" : String(v) })}
            />
          </div>
          <div>
            <FieldLabel>Lương tháng (đ)</FieldLabel>
            <InputNumber
              min={0}
              className="w-full"
              value={form.monthly_salary ? Number(form.monthly_salary) : undefined}
              onChange={(v) => set({ monthly_salary: v == null ? "" : String(v) })}
            />
          </div>
        </div>

        {!isEdit && (
          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
            <div>
              <FieldLabel required>Chuyên môn</FieldLabel>
              <Input
                placeholder="VD: IELTS"
                value={form.skill_name}
                onChange={(e) => set({ skill_name: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>Trình độ</FieldLabel>
              <Select
                value={form.skill_level}
                options={SKILL_LEVELS}
                onChange={(v) => set({ skill_level: v as string })}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
          <div>
            <FieldLabel>Ngân hàng</FieldLabel>
            <Input value={form.bank_name} onChange={(e) => set({ bank_name: e.target.value })} />
          </div>
          <div>
            <FieldLabel>Số tài khoản</FieldLabel>
            <Input
              value={form.bank_account_number}
              onChange={(e) => set({ bank_account_number: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Chủ tài khoản</FieldLabel>
            <Input
              value={form.bank_account_holder}
              onChange={(e) => set({ bank_account_holder: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Chi nhánh ngân hàng</FieldLabel>
            <Input value={form.bank_branch} onChange={(e) => set({ bank_branch: e.target.value })} />
          </div>
        </div>

        <div>
          <FieldLabel>Ghi chú</FieldLabel>
          <TextArea
            rows={2}
            className="w-full resize-none"
            value={form.note}
            onChange={(e) => set({ note: e.target.value })}
          />
        </div>
      </div>
    </FormScaff>
  );
};

export default TeacherFormModal;
