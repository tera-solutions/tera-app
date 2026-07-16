import { useEffect, useMemo, useState } from "react";
import { Modal, notification } from "tera-dls";

import { ClassRoomService, CourseService } from "@tera/modules/education";

import type { Classroom } from "../_interface";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none";
const labelClass = "mb-1 block text-xs font-medium text-slate-500";

const LEARNING_TYPES = [
  { value: "scheduled", label: "Theo lịch cố định" },
  { value: "self_learning", label: "Tự học" },
  { value: "flexible", label: "Linh hoạt" },
];

interface Props {
  open: boolean;
  classroom: Classroom | null;
  onClose: () => void;
}

const empty = {
  name: "",
  code: "",
  course_id: "" as number | "",
  learning_type: "scheduled",
  start_date: "",
  max_capacity: "20",
};

const ClassFormModal = ({ open, classroom, onClose }: Props) => {
  const isEdit = !!classroom;
  const { mutate: create, isPending: creating } = ClassRoomService.useClassRoomCreate();
  const { mutate: update, isPending: updating } = ClassRoomService.useClassRoomUpdate();

  const coursesQuery = CourseService.useCourseList({ params: { per_page: 100 } });
  const courses = useMemo(() => coursesQuery.data?.data?.items ?? [], [coursesQuery.data]);

  const [form, setForm] = useState(empty);
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (!open) return;
    if (classroom) {
      setForm({
        name: classroom.name ?? "",
        code: "",
        course_id: classroom.course_id ?? "",
        learning_type: "scheduled",
        start_date: "",
        max_capacity: String(classroom.max_students ?? 20),
      });
    } else {
      setForm(empty);
    }
  }, [open, classroom]);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      notification.warning({ message: "Vui lòng nhập tên lớp" });
      return;
    }
    const done = {
      onSuccess: () => {
        notification.success({ message: isEdit ? "Đã cập nhật lớp" : "Đã tạo lớp" });
        onClose();
      },
      onError: (e: any) =>
        notification.error({ message: e?.data?.msg?.message ?? e?.data?.msg ?? "Không thể lưu lớp" }),
    };

    if (isEdit && classroom) {
      update(
        {
          id: classroom.id,
          params: { name: form.name.trim(), max_capacity: Number(form.max_capacity || 1) },
        },
        done,
      );
    } else {
      if (!form.code.trim() || !form.course_id || !form.start_date) {
        notification.warning({ message: "Nhập mã lớp, khóa học và ngày bắt đầu" });
        return;
      }
      create(
        {
          params: {
            name: form.name.trim(),
            code: form.code.trim(),
            course_id: Number(form.course_id),
            learning_type: form.learning_type,
            start_date: form.start_date,
            max_capacity: Number(form.max_capacity || 1),
          },
        },
        done,
      );
    }
  };

  return (
    <Modal
      title={isEdit ? "Sửa lớp học" : "Tạo lớp học"}
      open={open}
      className="!w-[95%] xmd:!w-[520px]"
      okText={isEdit ? "Lưu" : "Tạo"}
      cancelText="Hủy"
      confirmLoading={creating || updating}
      onOk={handleSubmit}
      onCancel={onClose}
      destroyOnClose
    >
      <div className="space-y-3">
        <div>
          <label className={labelClass}>Tên lớp *</label>
          <input className={inputClass} value={form.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        {!isEdit && (
          <>
            <div>
              <label className={labelClass}>Mã lớp *</label>
              <input className={inputClass} value={form.code} onChange={(e) => set({ code: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Khóa học *</label>
              <select
                className={inputClass}
                value={form.course_id}
                onChange={(e) => set({ course_id: e.target.value ? Number(e.target.value) : "" })}
              >
                <option value="">— Chọn khóa học —</option>
                {courses.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Hình thức</label>
                <select
                  className={inputClass}
                  value={form.learning_type}
                  onChange={(e) => set({ learning_type: e.target.value })}
                >
                  {LEARNING_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Ngày bắt đầu *</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.start_date}
                  onChange={(e) => set({ start_date: e.target.value })}
                />
              </div>
            </div>
          </>
        )}
        <div>
          <label className={labelClass}>Sức chứa tối đa</label>
          <input
            type="number"
            min={1}
            className={inputClass}
            value={form.max_capacity}
            onChange={(e) => set({ max_capacity: e.target.value })}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ClassFormModal;
