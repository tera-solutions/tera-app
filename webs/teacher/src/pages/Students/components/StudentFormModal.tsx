import { useEffect, useMemo, useState } from "react";
import { notification, PencilSquareOutlined } from "tera-dls";

import { LevelService, StudentService } from "@tera/modules/education";
import { useStores } from "@tera/stores/useStores";
import { FileAPI } from "@tera/api/common/FileAPI";
import FormScaff from "@tera/components/dof/FormScaff";

import Avatar from "_common/components/Avatar";
import BranchSelect from "_common/components/BranchSelect";

const inputBaseClass =
  "rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none";
const inputClass = `w-full ${inputBaseClass}`;
const labelClass = "mb-1 block text-xs font-medium text-slate-500";

interface Props {
  open: boolean;
  /** null + isCreate=false = closed; null + isCreate=true = "Tạo học viên mới". */
  studentId: number | null;
  isCreate?: boolean;
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
  branch_id: "" as number | "",
  parent_name: "",
  parent_phone: "",
  avatar: "",
};

/** Create or edit a student profile. Editing keeps the original fields only;
 * creating additionally needs a branch (tenant-required) and accepts an
 * optional parent/guardian contact, same shape as Enrollment's inline "Học
 * viên mới" tab. */
const StudentFormModal = ({ open, studentId, isCreate = false, onClose }: Props) => {
  const { globalStore } = useStores();
  const isEdit = !isCreate && !!studentId;

  const detailQuery = StudentService.useStudentDetail(
    { id: studentId ?? "" },
    { enabled: isEdit && open },
  );
  const student = detailQuery.data?.data?.student;

  const levelsQuery = LevelService.useLevelList({ params: { per_page: 100 } });
  const levels = useMemo(() => levelsQuery.data?.data?.items ?? [], [levelsQuery.data]);

  const { mutate: create, isPending: isCreating } = StudentService.useStudentCreate();
  const { mutate: update, isPending: isUpdating } = StudentService.useStudentUpdate();
  const isPending = isCreating || isUpdating;

  const [form, setForm] = useState(emptyForm);
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
      return;
    }
    if (isEdit && student) {
      setForm({
        ...emptyForm,
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
        avatar: student.avatar_url ?? "",
      });
    }
  }, [open, isEdit, student]);

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

  const handleSubmit = () => {
    if (!form.name.trim()) {
      notification.warning({ message: "Vui lòng nhập họ tên" });
      return;
    }

    if (isEdit) {
      if (!studentId) return;
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
            avatar: form.avatar || null,
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
      return;
    }

    if (!form.dob) {
      notification.warning({ message: "Vui lòng nhập ngày sinh" });
      return;
    }
    if (!form.branch_id) {
      notification.warning({ message: "Vui lòng chọn chi nhánh" });
      return;
    }
    const businessId = Number(globalStore.user?.business_id ?? globalStore.business_id);
    create(
      {
        params: {
          name: form.name.trim(),
          gender: form.gender,
          dob: form.dob,
          email: form.email.trim() || undefined,
          phone: form.phone.trim() || undefined,
          level_id: form.level_id === "" ? undefined : Number(form.level_id),
          school: form.school.trim() || undefined,
          grade: form.grade.trim() || undefined,
          address: form.address.trim() || undefined,
          province: form.province.trim() || undefined,
          district: form.district.trim() || undefined,
          avatar: form.avatar || undefined,
          business_id: businessId,
          branch_id: Number(form.branch_id),
          enrollment_date: new Date().toISOString().slice(0, 10),
          parents: form.parent_name.trim()
            ? [{ name: form.parent_name.trim(), phone: form.parent_phone.trim() || undefined }]
            : undefined,
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Đã tạo học viên mới" });
          onClose();
        },
        onError: (e: any) =>
          notification.error({ message: e?.data?.msg ?? "Không thể tạo học viên" }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={isEdit}
      titleCreate="Tạo học viên mới"
      titleEdit="Sửa hồ sơ học viên"
      className="!w-[95%] xmd:!w-[600px]"
      confirmLoading={isPending}
      onOk={handleSubmit}
    >
      <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
        <div className="flex justify-center">
          <div className="relative">
            <Avatar src={form.avatar} alt={form.name} sizeClassName="h-20 w-20" />
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
            <label className={labelClass}>Ngày sinh {!isEdit && "*"}</label>
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

        {!isEdit && (
          <>
            <div>
              <label className={labelClass}>Chi nhánh *</label>
              <BranchSelect
                value={form.branch_id}
                onChange={(v) => set({ branch_id: v != null ? Number(v) : "" })}
                className={inputBaseClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
              <div>
                <label className={labelClass}>Tên phụ huynh</label>
                <input
                  className={inputClass}
                  value={form.parent_name}
                  onChange={(e) => set({ parent_name: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>SĐT phụ huynh</label>
                <input
                  className={inputClass}
                  value={form.parent_phone}
                  onChange={(e) => set({ parent_phone: e.target.value })}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </FormScaff>
  );
};

export default StudentFormModal;
