import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { DatePicker, Input, notification, Select } from "tera-dls";

import { LevelService, StudentService } from "@tera/modules/education";
import { useStores } from "@tera/stores/useStores";
import FormScaff from "@tera/components/dof/FormScaff";

import AvatarUpload from "_common/components/AvatarUpload";
import BranchSelect from "_common/components/BranchSelect";
import FieldLabel from "_common/components/FieldLabel";
import ParentSelect from "_common/components/ParentSelect";

const sectionTitleClass = "mb-1.5 text-sm font-semibold text-slate-700";
const DATE_FORMAT = "YYYY-MM-DD";

const GENDER_OPTIONS = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];

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
  parent_id: "" as number | "",
  parent_name: "",
  parent_phone: "",
  avatar: "",
};

/** Create or edit a student profile. Editing keeps the original fields only;
 * creating additionally requires a branch (tenant-required) and a parent —
 * business rule: a student cannot be created without one. The backend
 * `parents` field itself is nullable, so this is enforced client-side; unlike
 * the old flow, the parent can be an existing one (`parent_id`, avoiding
 * duplicate records) instead of always creating a brand new parent inline. */
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
    if (!form.parent_id && !form.parent_name.trim()) {
      notification.warning({ message: "Vui lòng chọn phụ huynh có sẵn hoặc nhập thông tin phụ huynh mới" });
      return;
    }
    if (!form.parent_id && !form.parent_phone.trim()) {
      notification.warning({ message: "Vui lòng nhập số điện thoại phụ huynh" });
      return;
    }

    const parents: Array<Record<string, unknown>> = form.parent_id
      ? [{ parent_id: Number(form.parent_id) }]
      : [{ name: form.parent_name.trim(), phone: form.parent_phone.trim() }];

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
          parents,
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
      <div className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
        <section className="space-y-3">
          <p className={sectionTitleClass}>Thông tin học viên</p>
          <div className="flex justify-center">
            <AvatarUpload
              src={form.avatar}
              alt={form.name}
              onUploaded={(url) => set({ avatar: url })}
            />
          </div>
          <div>
            <FieldLabel required>Họ tên</FieldLabel>
            <Input value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </div>
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
              <FieldLabel required={!isEdit}>Ngày sinh</FieldLabel>
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
              <FieldLabel>Email</FieldLabel>
              <Input value={form.email} onChange={(e) => set({ email: e.target.value })} />
            </div>
            <div>
              <FieldLabel>Số điện thoại</FieldLabel>
              <Input value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
            </div>
          </div>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-3">
          <p className={sectionTitleClass}>Học vấn &amp; Địa chỉ</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Trình độ</FieldLabel>
              <Select
                value={form.level_id}
                placeholder="— Chọn —"
                options={levels.map((l: any) => ({ value: l.id, label: l.level_name ?? l.name }))}
                onChange={(v) => set({ level_id: v != null ? Number(v) : "" })}
              />
            </div>
            <div>
              <FieldLabel>Trường</FieldLabel>
              <Input value={form.school} onChange={(e) => set({ school: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Khối/Lớp</FieldLabel>
              <Input value={form.grade} onChange={(e) => set({ grade: e.target.value })} />
            </div>
            <div>
              <FieldLabel>Tỉnh/Thành</FieldLabel>
              <Input value={form.province} onChange={(e) => set({ province: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Quận/Huyện</FieldLabel>
              <Input value={form.district} onChange={(e) => set({ district: e.target.value })} />
            </div>
            <div>
              <FieldLabel>Địa chỉ</FieldLabel>
              <Input value={form.address} onChange={(e) => set({ address: e.target.value })} />
            </div>
          </div>
        </section>

        {!isEdit && (
          <section className="space-y-3 border-t border-slate-100 pt-3">
            <p className={sectionTitleClass}>Chi nhánh &amp; Phụ huynh</p>
            <div>
              <FieldLabel required>Chi nhánh</FieldLabel>
              <BranchSelect
                value={form.branch_id}
                onChange={(v) => set({ branch_id: v != null ? Number(v) : "" })}
              />
            </div>
            <div>
              <FieldLabel required>Phụ huynh có sẵn</FieldLabel>
              <ParentSelect
                value={form.parent_id}
                onChange={(v) =>
                  set({ parent_id: v != null ? Number(v) : "", parent_name: "", parent_phone: "" })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel required={!form.parent_id}>Tên phụ huynh mới</FieldLabel>
                <Input
                  value={form.parent_name}
                  disabled={!!form.parent_id}
                  onChange={(e) => set({ parent_name: e.target.value })}
                />
              </div>
              <div>
                <FieldLabel required={!form.parent_id}>SĐT phụ huynh mới</FieldLabel>
                <Input
                  value={form.parent_phone}
                  disabled={!!form.parent_id}
                  onChange={(e) => set({ parent_phone: e.target.value })}
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </FormScaff>
  );
};

export default StudentFormModal;
