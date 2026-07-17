import { useEffect, useState } from "react";
import { Modal, notification } from "tera-dls";

import { CourseService } from "@tera/modules/education";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none";
const labelClass = "mb-1 block text-xs font-medium text-slate-500";

export interface CourseRow {
  id: number;
  code: string;
  name: string;
  duration_minutes: number | string;
  price_per_lesson: number | string;
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
  code: "",
  duration_minutes: "60",
  price_per_lesson: "0",
  description: "",
  is_active: true,
};

const CourseFormModal = ({ open, course, onClose }: Props) => {
  const isEdit = !!course;
  const { mutate: create, isPending: creating } = CourseService.useCourseCreate();
  const { mutate: update, isPending: updating } = CourseService.useCourseUpdate();

  const [form, setForm] = useState(empty);
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (!open) return;
    if (course) {
      setForm({
        name: course.name ?? "",
        code: course.code ?? "",
        duration_minutes: String(course.duration_minutes ?? 60),
        price_per_lesson: String(course.price_per_lesson ?? 0),
        description: course.description ?? "",
        is_active: course.is_active ?? true,
      });
    } else {
      setForm(empty);
    }
  }, [open, course]);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      notification.warning({ message: "Vui lòng nhập tên khóa học" });
      return;
    }
    const params: Record<string, unknown> = {
      name: form.name.trim(),
      duration_minutes: Number(form.duration_minutes || 0),
      price_per_lesson: Number(form.price_per_lesson || 0),
      description: form.description.trim() || null,
      is_active: form.is_active,
    };

    const done = {
      onSuccess: () => {
        notification.success({ message: isEdit ? "Đã cập nhật khóa học" : "Đã tạo khóa học" });
        onClose();
      },
      onError: (e: any) =>
        notification.error({ message: e?.data?.msg?.message ?? e?.data?.msg ?? "Không thể lưu khóa học" }),
    };

    if (isEdit && course) {
      update({ id: course.id, params }, done);
    } else {
      if (!form.code.trim()) {
        notification.warning({ message: "Vui lòng nhập mã khóa học" });
        return;
      }
      create({ params: { ...params, code: form.code.trim().toUpperCase() } }, done);
    }
  };

  return (
    <Modal
      title={isEdit ? "Sửa khóa học" : "Tạo khóa học"}
      open={open}
      className="!w-[95%] xmd:!w-[540px]"
      okText={isEdit ? "Lưu" : "Tạo"}
      cancelText="Hủy"
      confirmLoading={creating || updating}
      onOk={handleSubmit}
      onCancel={onClose}
      destroyOnClose
    >
      <div className="space-y-3">
        <div>
          <label className={labelClass}>Tên khóa học *</label>
          <input className={inputClass} value={form.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        {!isEdit && (
          <div>
            <label className={labelClass}>Mã khóa học * (A-Z, 0-9, _)</label>
            <input
              className={inputClass}
              value={form.code}
              onChange={(e) => set({ code: e.target.value.toUpperCase() })}
              placeholder="IELTS_FOUNDATION"
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Thời lượng (phút) *</label>
            <input
              type="number"
              min={1}
              className={inputClass}
              value={form.duration_minutes}
              onChange={(e) => set({ duration_minutes: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Học phí / buổi (₫) *</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.price_per_lesson}
              onChange={(e) => set({ price_per_lesson: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Mô tả</label>
          <textarea
            className={inputClass}
            rows={3}
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => set({ is_active: e.target.checked })}
          />
          Đang mở
        </label>
      </div>
    </Modal>
  );
};

export default CourseFormModal;
