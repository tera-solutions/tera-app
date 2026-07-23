import { useEffect, useMemo, useState } from "react";
import { Input, InputNumber, notification, Select, TextArea } from "tera-dls";

import { CourseService, LevelService } from "@tera/modules/education";
import FormScaff from "@tera/components/dof/FormScaff";
import FieldLabel from "_common/components/FieldLabel";

const STATUS_OPTIONS = [
  { value: "active", label: "Đang áp dụng" },
  { value: "inactive", label: "Ngừng" },
];

export interface LevelRow {
  id: number;
  level_code: string;
  level_name: string;
  course_id: number | null;
  level_order: number | string;
  cefr_level?: string | null;
  description?: string | null;
  status?: string;
}

interface Props {
  open: boolean;
  level: LevelRow | null;
  onClose: () => void;
}

const empty = {
  level_code: "",
  level_name: "",
  course_id: "" as number | "",
  level_order: "1",
  cefr_level: "",
  description: "",
  status: "active",
};

const LevelFormModal = ({ open, level, onClose }: Props) => {
  const isEdit = !!level;
  const { mutate: create, isPending: creating } = LevelService.useLevelCreate();
  const { mutate: update, isPending: updating } = LevelService.useLevelUpdate();

  const coursesQuery = CourseService.useCourseList({ params: { per_page: 100 } });
  const courses = useMemo(() => coursesQuery.data?.data?.items ?? [], [coursesQuery.data]);

  const [form, setForm] = useState(empty);
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (!open) return;
    if (level) {
      setForm({
        level_code: level.level_code ?? "",
        level_name: level.level_name ?? "",
        course_id: level.course_id ?? "",
        level_order: String(level.level_order ?? 1),
        cefr_level: level.cefr_level ?? "",
        description: level.description ?? "",
        status: level.status ?? "active",
      });
    } else {
      setForm(empty);
    }
  }, [open, level]);

  const handleSubmit = () => {
    if (!form.level_name.trim()) {
      notification.warning({ message: "Vui lòng nhập tên trình độ" });
      return;
    }
    if (!form.course_id) {
      notification.warning({ message: "Vui lòng chọn khóa học" });
      return;
    }
    const base = {
      level_name: form.level_name.trim(),
      course_id: Number(form.course_id),
      level_order: Number(form.level_order || 1),
      cefr_level: form.cefr_level.trim() || null,
      description: form.description.trim() || null,
      status: form.status,
    };
    const done = {
      onSuccess: () => {
        notification.success({ message: isEdit ? "Đã cập nhật trình độ" : "Đã tạo trình độ" });
        onClose();
      },
      onError: (e: any) =>
        notification.error({ message: e?.data?.msg?.message ?? e?.data?.msg ?? "Không thể lưu trình độ" }),
    };

    if (isEdit && level) {
      update({ id: level.id, params: base }, done);
    } else {
      if (!form.level_code.trim()) {
        notification.warning({ message: "Vui lòng nhập mã trình độ" });
        return;
      }
      create({ params: { ...base, level_code: form.level_code.trim() } }, done);
    }
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={isEdit}
      titleCreate="Tạo trình độ"
      titleEdit="Sửa trình độ"
      className="!w-[95%] xmd:!w-[520px]"
      confirmLoading={creating || updating}
      onOk={handleSubmit}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {!isEdit && (
            <div>
              <FieldLabel required>Mã trình độ</FieldLabel>
              <Input
                value={form.level_code}
                onChange={(e) => set({ level_code: e.target.value })}
                placeholder="A1"
              />
            </div>
          )}
          <div className={isEdit ? "col-span-2" : ""}>
            <FieldLabel required>Tên trình độ</FieldLabel>
            <Input
              value={form.level_name}
              onChange={(e) => set({ level_name: e.target.value })}
              placeholder="Sơ cấp A1"
            />
          </div>
        </div>
        <div>
          <FieldLabel required>Khóa học</FieldLabel>
          <Select
            value={form.course_id}
            placeholder="— Chọn khóa học —"
            options={courses.map((c: any) => ({ value: c.id, label: c.name }))}
            onChange={(v) => set({ course_id: v != null ? Number(v) : "" })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel required>Thứ tự</FieldLabel>
            <InputNumber
              min={1}
              className="w-full"
              value={form.level_order ? Number(form.level_order) : undefined}
              onChange={(v) => set({ level_order: v == null ? "" : String(v) })}
            />
          </div>
          <div>
            <FieldLabel>CEFR</FieldLabel>
            <Input
              value={form.cefr_level}
              onChange={(e) => set({ cefr_level: e.target.value })}
              placeholder="A1 / B2 ..."
            />
          </div>
        </div>
        <div>
          <FieldLabel>Mô tả</FieldLabel>
          <TextArea
            className="w-full"
            rows={2}
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel>Trạng thái</FieldLabel>
          <Select
            value={form.status}
            options={STATUS_OPTIONS}
            onChange={(v) => set({ status: v as string })}
          />
        </div>
      </div>
    </FormScaff>
  );
};

export default LevelFormModal;
