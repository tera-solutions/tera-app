import { useEffect, useState } from "react";
import { Checkbox, Input, InputNumber, notification, Select, TextArea } from "tera-dls";

import { CourseService } from "@tera/modules/education";
import FormScaff from "@tera/components/dof/FormScaff";
import FieldLabel from "_common/components/FieldLabel";
import { useMeta } from "_common/hooks/useMeta";

export interface CourseRow {
  id: number;
  code: string;
  name: string;
  title?: string | null;
  duration_minutes: number | string;
  price_per_lesson: number | string;
  tuition_type?: string | null;
  description?: string | null;
  is_active?: boolean;
}

interface Props {
  open: boolean;
  course: CourseRow | null;
  onClose: () => void;
}

const empty = {
  name: "",
  title: "",
  duration_minutes: "60",
  price_per_lesson: "0",
  tuition_type: "per_lesson",
  description: "",
  is_active: true,
};

/** Edit-only — creating a course happens on the dedicated `pages/CourseCreate`
 * page (mã khóa học + chương trình học only make sense at creation time). */
const CourseFormModal = ({ open, course, onClose }: Props) => {
  const { getOptions } = useMeta();
  const { mutate: update, isPending: updating } = CourseService.useCourseUpdate();

  const [form, setForm] = useState(empty);
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (!open || !course) return;
    setForm({
      name: course.name ?? "",
      title: course.title ?? "",
      duration_minutes: String(course.duration_minutes ?? 60),
      price_per_lesson: String(course.price_per_lesson ?? 0),
      tuition_type: course.tuition_type ?? "per_lesson",
      description: course.description ?? "",
      is_active: course.is_active ?? true,
    });
  }, [open, course]);

  const handleSubmit = () => {
    if (!course) return;
    if (!form.name.trim()) {
      notification.warning({ message: "Vui lòng nhập tên khóa học" });
      return;
    }

    update(
      {
        id: course.id,
        params: {
          name: form.name.trim(),
          title: form.title.trim() || null,
          duration_minutes: Number(form.duration_minutes || 0),
          price_per_lesson: Number(form.price_per_lesson || 0),
          tuition_type: form.tuition_type,
          description: form.description.trim() || null,
          is_active: form.is_active,
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Đã cập nhật khóa học" });
          onClose();
        },
        onError: (e: any) =>
          notification.error({ message: e?.data?.msg?.message ?? e?.data?.msg ?? "Không thể lưu khóa học" }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit
      titleCreate="Sửa khóa học"
      titleEdit="Sửa khóa học"
      className="!w-[95%] xmd:!w-[540px]"
      confirmLoading={updating}
      onOk={handleSubmit}
    >
      <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
        <div>
          <FieldLabel required>Tên khóa học</FieldLabel>
          <Input value={form.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        <div>
          <FieldLabel>Tiêu đề hiển thị</FieldLabel>
          <Input value={form.title} onChange={(e) => set({ title: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel required>Thời lượng (phút)</FieldLabel>
            <InputNumber
              min={1}
              className="w-full"
              value={form.duration_minutes ? Number(form.duration_minutes) : undefined}
              onChange={(v) => set({ duration_minutes: v == null ? "" : String(v) })}
            />
          </div>
          <div>
            <FieldLabel required>Học phí / buổi (₫)</FieldLabel>
            <InputNumber
              min={0}
              className="w-full"
              value={form.price_per_lesson ? Number(form.price_per_lesson) : undefined}
              onChange={(v) => set({ price_per_lesson: v == null ? "" : String(v) })}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Loại học phí</FieldLabel>
          <Select
            value={form.tuition_type}
            options={getOptions("course_tuition_type").map((o) => ({ value: o.value, label: o.label }))}
            onChange={(v: any) => set({ tuition_type: v })}
          />
        </div>
        <div>
          <FieldLabel>Mô tả</FieldLabel>
          <TextArea
            className="w-full"
            rows={3}
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
          />
        </div>
        <Checkbox checked={form.is_active} onChange={(e) => set({ is_active: e.target.checked })}>
          <p className="mb-1 block text-xs font-medium text-slate-500">Đang mở</p>
        </Checkbox>
      </div>
    </FormScaff>
  );
};

export default CourseFormModal;
