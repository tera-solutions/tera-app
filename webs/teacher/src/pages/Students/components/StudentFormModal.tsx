import { useEffect, useMemo, useState } from "react";
import { Modal, notification } from "tera-dls";

import { LevelService, StudentService } from "@tera/modules/education";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none";
const labelClass = "mb-1 block text-xs font-medium text-slate-500";

interface Props {
  open: boolean;
  studentId: number | null;
  onClose: () => void;
}

const emptyForm = {
  name: "",
  gender: "male",
  dob: "",
  email: "",
  phone: "",
  level_id: "" as number | "",
  school: "",
  grade: "",
  address: "",
  province: "",
  district: "",
};

/** Edit an existing student's profile. New students are onboarded via Enrollment. */
const StudentFormModal = ({ open, studentId, onClose }: Props) => {
  const detailQuery = StudentService.useStudentDetail(
    { id: studentId ?? "" },
    { enabled: !!studentId && open },
  );
  const student = detailQuery.data?.data?.student;

  const levelsQuery = LevelService.useLevelList({ params: { per_page: 100 } });
  const levels = useMemo(() => levelsQuery.data?.data?.items ?? [], [levelsQuery.data]);

  const { mutate: update, isPending } = StudentService.useStudentUpdate();

  const [form, setForm] = useState(emptyForm);
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (open && student) {
      setForm({
        name: student.name ?? "",
        gender: student.gender ?? "male",
        dob: student.dob ?? "",
        email: student.email ?? "",
        phone: student.phone ?? "",
        level_id: student.level_id ?? "",
        school: student.school ?? "",
        grade: student.grade ?? "",
        address: student.address ?? "",
        province: student.province ?? "",
        district: student.district ?? "",
      });
    }
    if (!open) setForm(emptyForm);
  }, [open, student]);

  const handleSubmit = () => {
    if (!studentId) return;
    if (!form.name.trim()) {
      notification.warning({ message: "Vui lòng nhập họ tên" });
      return;
    }
    update(
      {
        id: studentId,
        params: {
          name: form.name.trim(),
          gender: form.gender,
          dob: form.dob || undefined,
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          level_id: form.level_id === "" ? null : Number(form.level_id),
          school: form.school.trim() || null,
          grade: form.grade.trim() || null,
          address: form.address.trim() || null,
          province: form.province.trim() || null,
          district: form.district.trim() || null,
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Cập nhật học viên thành công" });
          onClose();
        },
        onError: (e: any) =>
          notification.error({ message: e?.data?.msg ?? "Không thể cập nhật học viên" }),
      },
    );
  };

  return (
    <Modal
      title="Sửa hồ sơ học viên"
      open={open}
      className="!w-[95%] xmd:!w-[600px]"
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isPending}
      onOk={handleSubmit}
      onCancel={onClose}
      destroyOnClose
    >
      <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
        <div>
          <label className={labelClass}>Họ tên *</label>
          <input className={inputClass} value={form.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
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
            <label className={labelClass}>Email</label>
            <input className={inputClass} value={form.email} onChange={(e) => set({ email: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Số điện thoại</label>
            <input className={inputClass} value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Trình độ</label>
            <select
              className={inputClass}
              value={form.level_id}
              onChange={(e) => set({ level_id: e.target.value ? Number(e.target.value) : "" })}
            >
              <option value="">— Chọn —</option>
              {levels.map((l: any) => (
                <option key={l.id} value={l.id}>
                  {l.level_name ?? l.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Trường</label>
            <input className={inputClass} value={form.school} onChange={(e) => set({ school: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Khối/Lớp</label>
            <input className={inputClass} value={form.grade} onChange={(e) => set({ grade: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Tỉnh/Thành</label>
            <input className={inputClass} value={form.province} onChange={(e) => set({ province: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Quận/Huyện</label>
            <input className={inputClass} value={form.district} onChange={(e) => set({ district: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Địa chỉ</label>
            <input className={inputClass} value={form.address} onChange={(e) => set({ address: e.target.value })} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StudentFormModal;
