import { useEffect, useState } from "react";
import { notification, PencilSquareOutlined } from "tera-dls";

import { TeacherService } from "@tera/modules/hr";
import { FileAPI } from "@tera/api/common/FileAPI";
import FormScaff from "@tera/components/dof/FormScaff";

import Avatar from "_common/components/Avatar";
import BranchSelect from "_common/components/BranchSelect";
import { useMeta } from "_common/hooks/useMeta";

import type { Teacher } from "../_interface";
import { EMPLOYMENT_TYPES, TEACHER_TYPE_META } from "../constants";

const inputBaseClass =
  "rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none";
const inputClass = `w-full ${inputBaseClass}`;
const labelClass = "mb-1 block text-xs font-medium text-slate-500";

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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const uploaded = await FileAPI.upload(file);
      set({ avatar: uploaded.url });
    } catch {
      notification.error({ message: "Tải ảnh lên thất bại" });
    } finally {
      setUploadingAvatar(false);
    }
  };

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
          <div className="relative">
            <Avatar src={form.avatar} alt={form.full_name} sizeClassName="h-20 w-20" />
            <label className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-brand text-white [&_svg]:h-3.5 [&_svg]:w-3.5">
              <PencilSquareOutlined />
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleAvatarSelect}
                disabled={uploadingAvatar}
              />
            </label>
          </div>
        </div>

        <div>
          <label className={labelClass}>Họ tên *</label>
          <input className={inputClass} value={form.full_name} onChange={(e) => set({ full_name: e.target.value })} />
        </div>

        {!isEdit && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Mã giáo viên *</label>
              <input className={inputClass} value={form.code} onChange={(e) => set({ code: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Ngày vào làm *</label>
              <input
                type="date"
                className={inputClass}
                value={form.joined_at}
                onChange={(e) => set({ joined_at: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Giới tính</label>
            <select className={inputClass} value={form.gender} onChange={(e) => set({ gender: e.target.value })}>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Ngày sinh</label>
            <input type="date" className={inputClass} value={form.dob} onChange={(e) => set({ dob: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Email {!isEdit && "*"}</label>
            <input className={inputClass} value={form.email} onChange={(e) => set({ email: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Số điện thoại {!isEdit && "*"}</label>
            <input className={inputClass} value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>CMND/CCCD</label>
            <input
              className={inputClass}
              value={form.identity_no}
              onChange={(e) => set({ identity_no: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Địa chỉ</label>
            <input className={inputClass} value={form.address} onChange={(e) => set({ address: e.target.value })} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Chi nhánh {!isEdit && "*"}</label>
          <BranchSelect
            value={form.branch_id}
            onChange={(v) => set({ branch_id: v != null ? Number(v) : "" })}
            className={inputBaseClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
          <div>
            <label className={labelClass}>Hình thức làm việc</label>
            <select
              className={inputClass}
              value={form.teacher_type}
              onChange={(e) => set({ teacher_type: e.target.value })}
            >
              {getOptions(TEACHER_TYPE_META).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Loại hợp tác</label>
            <select
              className={inputClass}
              value={form.employment_type}
              onChange={(e) => set({ employment_type: e.target.value })}
            >
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Lương theo giờ (đ)</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.hourly_rate}
              onChange={(e) => set({ hourly_rate: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Lương tháng (đ)</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.monthly_salary}
              onChange={(e) => set({ monthly_salary: e.target.value })}
            />
          </div>
        </div>

        {!isEdit && (
          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
            <div>
              <label className={labelClass}>Chuyên môn *</label>
              <input
                placeholder="VD: IELTS"
                className={inputClass}
                value={form.skill_name}
                onChange={(e) => set({ skill_name: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Trình độ</label>
              <select
                className={inputClass}
                value={form.skill_level}
                onChange={(e) => set({ skill_level: e.target.value })}
              >
                {SKILL_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
          <div>
            <label className={labelClass}>Ngân hàng</label>
            <input className={inputClass} value={form.bank_name} onChange={(e) => set({ bank_name: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Số tài khoản</label>
            <input
              className={inputClass}
              value={form.bank_account_number}
              onChange={(e) => set({ bank_account_number: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Chủ tài khoản</label>
            <input
              className={inputClass}
              value={form.bank_account_holder}
              onChange={(e) => set({ bank_account_holder: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Chi nhánh ngân hàng</label>
            <input
              className={inputClass}
              value={form.bank_branch}
              onChange={(e) => set({ bank_branch: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Ghi chú</label>
          <textarea
            rows={2}
            className={`${inputClass} resize-none`}
            value={form.note}
            onChange={(e) => set({ note: e.target.value })}
          />
        </div>
      </div>
    </FormScaff>
  );
};

export default TeacherFormModal;
