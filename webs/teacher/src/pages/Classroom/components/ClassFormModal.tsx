import { useEffect, useMemo, useState } from "react";
import { notification, PencilSquareOutlined } from "tera-dls";

import { ClassRoomService, CourseService, LessonPlanService } from "@tera/modules/education";
import FormScaff from "@tera/components/dof/FormScaff";
import { FileAPI } from "@tera/api/common/FileAPI";

import Avatar from "_common/components/Avatar";
import useCurrentTeacher from "_common/hooks/useCurrentTeacher";

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
  lesson_plan_id: "" as number | "",
  learning_type: "scheduled",
  start_date: "",
  avatar: "",
  min_warning_capacity: "",
  min_capacity: "",
  max_warning_capacity: "",
  max_capacity: "20",
};

/** Creates or edits the class itself only — its schedule is a separate Timetable,
 * created afterwards from the "Lịch dạy" page (timetable-management.md). */
const ClassFormModal = ({ open, classroom, onClose }: Props) => {
  const isEdit = !!classroom;
  const { mutate: create, isPending: creating } = ClassRoomService.useClassRoomCreate();
  const { mutate: update, isPending: updating } = ClassRoomService.useClassRoomUpdate();
  const { teacherId } = useCurrentTeacher();

  const coursesQuery = CourseService.useCourseList({ params: { per_page: 100 } });
  const courses = useMemo(() => coursesQuery.data?.data?.items ?? [], [coursesQuery.data]);

  const [form, setForm] = useState(empty);
  // Chỉ giáo án đã xuất bản mới sinh được Lesson khi tạo Timetable (lesson.md §7).
  const lessonPlansQuery = LessonPlanService.useLessonPlanList({
    params: {
      per_page: 100,
      filters: { status: "published", course_id: form.course_id || undefined },
    },
  });
  const lessonPlans = useMemo(
    () => lessonPlansQuery.data?.data?.items ?? [],
    [lessonPlansQuery.data],
  );
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (classroom) {
      setForm({
        name: classroom.name ?? "",
        code: "",
        course_id: classroom.course_id ?? "",
        lesson_plan_id: classroom.lesson_plan_id ?? "",
        learning_type: "scheduled",
        start_date: "",
        avatar: classroom.cover_image ?? "",
        min_warning_capacity:
          classroom.min_warning_capacity != null ? String(classroom.min_warning_capacity) : "",
        min_capacity: classroom.min_capacity != null ? String(classroom.min_capacity) : "",
        max_warning_capacity:
          classroom.max_warning_capacity != null ? String(classroom.max_warning_capacity) : "",
        max_capacity: String(classroom.max_students ?? 20),
      });
    } else {
      setForm(empty);
    }
  }, [open, classroom]);

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
      notification.warning({ message: "Vui lòng nhập tên lớp" });
      return;
    }
    const capacityParams = {
      min_warning_capacity: form.min_warning_capacity ? Number(form.min_warning_capacity) : undefined,
      min_capacity: form.min_capacity ? Number(form.min_capacity) : undefined,
      max_warning_capacity: form.max_warning_capacity ? Number(form.max_warning_capacity) : undefined,
      max_capacity: Number(form.max_capacity || 1),
    };
    const done = {
      onSuccess: () => {
        notification.success({
          message: isEdit
            ? "Đã cập nhật lớp"
            : "Đã tạo lớp. Vào Lịch dạy để tạo thời khóa biểu cho lớp này.",
        });
        onClose();
      },
      onError: (e: any) =>
        notification.error({ message: e?.data?.msg?.message ?? e?.data?.msg ?? "Không thể lưu lớp" }),
    };

    if (isEdit && classroom) {
      update(
        {
          id: classroom.id,
          params: {
            name: form.name.trim(),
            avatar: form.avatar || undefined,
            lesson_plan_id: form.lesson_plan_id ? Number(form.lesson_plan_id) : undefined,
            ...capacityParams,
          },
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
            lesson_plan_id: form.lesson_plan_id ? Number(form.lesson_plan_id) : undefined,
            learning_type: form.learning_type,
            start_date: form.start_date,
            avatar: form.avatar || undefined,
            teacher_id: teacherId ?? undefined,
            ...capacityParams,
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
      titleCreate="Tạo lớp học"
      titleEdit="Sửa lớp học"
      className="!w-[95%] xmd:!w-[520px]"
      confirmLoading={creating || updating}
      onOk={handleSubmit}
    >
      <div className="space-y-3">
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
          <label className={labelClass}>Tên lớp *</label>
          <input className={inputClass} value={form.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Giáo án</label>
          <select
            className={inputClass}
            value={form.lesson_plan_id}
            onChange={(e) => set({ lesson_plan_id: e.target.value ? Number(e.target.value) : "" })}
          >
            <option value="">— Chưa gắn giáo án —</option>
            {lessonPlans.map((lp: any) => (
              <option key={lp.id} value={lp.id}>
                {lp.plan_name ?? lp.name} {lp.plan_code ? `(${lp.plan_code})` : ""}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-400">
            Chỉ hiện giáo án đã xuất bản. Gắn giáo án để hệ thống tự sinh bài học khi bạn tạo
            thời khóa biểu cho lớp.
          </p>
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
            {form.learning_type === "scheduled" && (
              <p className="rounded-lg bg-sky-50 px-3 py-2 text-xs text-slate-500">
                Lớp sẽ ở trạng thái "Chưa cập nhật" cho tới khi bạn tạo thời khóa biểu cho lớp
                này ở trang Lịch dạy.
              </p>
            )}
          </>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Sĩ số cảnh báo tối thiểu</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.min_warning_capacity}
              onChange={(e) => set({ min_warning_capacity: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Sĩ số tối thiểu</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.min_capacity}
              onChange={(e) => set({ min_capacity: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Sĩ số cảnh báo tối đa</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.max_warning_capacity}
              onChange={(e) => set({ max_warning_capacity: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Sĩ số tối đa *</label>
            <input
              type="number"
              min={1}
              className={inputClass}
              value={form.max_capacity}
              onChange={(e) => set({ max_capacity: e.target.value })}
            />
          </div>
        </div>
      </div>
    </FormScaff>
  );
};

export default ClassFormModal;
